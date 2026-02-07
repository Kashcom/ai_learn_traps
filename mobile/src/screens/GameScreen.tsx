import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, HelpCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function GameScreen() {
    const { colors } = useTheme();
    const { userId, refreshStats } = useUser();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { chapterId, chapterTitle } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
    const [result, setResult] = useState<'correct' | 'trap' | 'wrong' | null>(null);

    // Animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (!loading) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
            ]).start();
        }
    }, [currentIdx, loading]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const API_URL = 'http://10.0.2.2:8000';
            let data = [];

            if (chapterId) {
                // Fetch extracted questions
                const res = await fetch(`${API_URL}/chapters/${chapterId}/questions`);
                data = await res.json();
            } else {
                // Fallback to random gen if no chapter
                const res = await fetch(`${API_URL}/generate-question/math`);
                data = [await res.json()];
            }

            if (data.length === 0) throw new Error("No questions");
            setQuestions(data);
        } catch (e) {
            console.error(e);
            // Mock
            setQuestions([{
                id: 'mock',
                text: 'Sample Question: What is 2 + 2?',
                options: [
                    { id: '1', text: '3', isCorrect: false },
                    { id: '2', text: '4', isCorrect: true },
                    { id: '3', text: '5', isCorrect: false }
                ]
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (opt: any) => {
        if (result) return;
        setSelectedOpt(opt.id);

        let resType: 'correct' | 'trap' | 'wrong' = 'wrong';
        if (opt.isCorrect) resType = 'correct';
        else if (opt.isTrap) resType = 'trap';
        setResult(resType);

        // Submit Answer
        try {
            const API_URL = 'http://10.0.2.2:8000';
            await fetch(`${API_URL}/submit-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    question_id: questions[currentIdx].id,
                    selected_option_id: opt.id,
                    is_correct: opt.isCorrect,
                    is_trap: opt.isTrap || false
                })
            });
            refreshStats();
        } catch (e) {
            console.error("Failed to submit", e);
        }
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setResult(null);
            setSelectedOpt(null);
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            setCurrentIdx(prev => prev + 1);
        } else {
            // End of Quiz
            navigation.goBack();
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header / Progress */}
            <View style={styles.header}>
                <Text style={[styles.chapterTitle, { color: colors.textSecondary }]}>
                    {chapterTitle || "Quick Play"}
                </Text>
                <View style={[styles.progressBadge, { backgroundColor: colors.card }]}>
                    <Text style={[styles.progressText, { color: colors.primary }]}>
                        {currentIdx + 1} / {questions.length}
                    </Text>
                </View>
            </View>

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: colors.primary }]} />
            </View>

            {/* Question Card */}
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.qHeader}>
                        <HelpCircle color={colors.primary} size={24} />
                        <Text style={[styles.qLabel, { color: colors.textSecondary }]}>Question {currentIdx + 1}</Text>
                    </View>

                    <Text style={[styles.questionText, { color: colors.text }]}>{currentQ.text}</Text>

                    {/* Options Grid */}
                    <View style={styles.optionsGrid}>
                        {currentQ.options.map((opt: any, idx: number) => {
                            let stateColor = 'rgba(255,255,255,0.1)';
                            let bgColor = 'transparent';

                            if (result) {
                                if (opt.id === selectedOpt) {
                                    if (result === 'correct') { stateColor = colors.success; bgColor = 'rgba(34, 197, 94, 0.1)'; }
                                    else if (result === 'trap') { stateColor = colors.warning; bgColor = 'rgba(234, 179, 8, 0.1)'; }
                                    else { stateColor = colors.danger; bgColor = 'rgba(239, 68, 68, 0.1)'; }
                                } else if (opt.isCorrect) {
                                    stateColor = colors.success;
                                    bgColor = 'rgba(34, 197, 94, 0.1)';
                                }
                            } else {
                                stateColor = colors.primary; // default border
                            }

                            return (
                                <TouchableOpacity
                                    key={opt.id}
                                    style={[
                                        styles.optionBtn,
                                        {
                                            borderColor: stateColor,
                                            backgroundColor: bgColor
                                        }
                                    ]}
                                    onPress={() => handleSelect(opt)}
                                    disabled={!!result}
                                >
                                    <View style={[styles.optCircle, { borderColor: stateColor }]}>
                                        <Text style={{ color: stateColor, fontWeight: 'bold' }}>
                                            {String.fromCharCode(65 + idx)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.text }]}>{opt.text}</Text>

                                    {result && opt.id === selectedOpt && (
                                        <View style={{ marginLeft: 'auto' }}>
                                            {result === 'correct' && <CheckCircle size={20} color={colors.success} />}
                                            {result === 'trap' && <AlertTriangle size={20} color={colors.warning} />}
                                            {result === 'wrong' && <XCircle size={20} color={colors.danger} />}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>

            {/* Bottom Action Area */}
            {result && (
                <View style={[styles.botSheet, { backgroundColor: colors.card, borderTopColor: colors.highlight }]}>
                    <Text style={[
                        styles.feedbackTitle,
                        { color: result === 'correct' ? colors.success : result === 'trap' ? colors.warning : colors.danger }
                    ]}>
                        {result === 'correct' ? 'Correct!' : result === 'trap' ? "That's a Trap!" : 'Incorrect'}
                    </Text>
                    <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
                        {result !== 'correct' ? (currentQ.explanation || (currentQ.options.find((o: any) => o.id === selectedOpt)?.feedback) || "Review the concept.") : "Great job!"}
                    </Text>
                    <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={nextQuestion}>
                        <Text style={styles.nextBtnText}>Continue</Text>
                        <ArrowRight color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chapterTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    progressBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    progressText: { fontWeight: 'bold', fontSize: 12 },
    progressBar: { height: 4, backgroundColor: 'rgba(0,0,0,0.1)', width: '100%' },
    progressFill: { height: '100%' },

    content: { flex: 1, padding: 20 },
    card: {
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    qHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    qLabel: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
    questionText: { fontSize: 22, fontWeight: 'bold', lineHeight: 30, marginBottom: 32 },

    optionsGrid: { gap: 12 },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
    },
    optCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: { fontSize: 16, fontWeight: '500', flex: 1 },

    botSheet: {
        padding: 24,
        borderTopWidth: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    feedbackTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    feedbackText: { fontSize: 14, marginBottom: 20 },
    nextBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
});
