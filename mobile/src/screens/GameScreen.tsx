import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';

export default function GameScreen() {
    const { colors } = useTheme();
    const { userId, refreshStats } = useUser();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const topic = route.params?.topic || 'math';

    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState<any>(null);
    const [timer, setTimer] = useState(30);
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
    const [result, setResult] = useState<'correct' | 'trap' | 'wrong' | null>(null);

    // Animation values
    const progressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fetchQuestion();
    }, []);

    useEffect(() => {
        if (!loading && !result && timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);

            Animated.timing(progressAnim, {
                toValue: (timer - 1) / 30,
                duration: 1000,
                useNativeDriver: false,
            }).start();

            return () => clearInterval(interval);
        }
    }, [timer, loading, result]);

    const fetchQuestion = async () => {
        setLoading(true);
        try {
            // Use 10.0.2.2 for Android Emulator access to localhost
            const API_URL = 'http://10.0.2.2:8000';
            const res = await fetch(`${API_URL}/generate-question/${topic}`);
            const data = await res.json();
            setQuestion(data);
            setTimer(30);
            progressAnim.setValue(1);
            setSelectedOpt(null);
            setResult(null);
        } catch (e) {
            console.error(e);
            // Fallback mock
            setQuestion({
                id: 'mock',
                text: 'Connection Error. Is 5 > 3?',
                options: [
                    { id: '1', text: 'Yes', isCorrect: true },
                    { id: '2', text: 'No', isCorrect: false }
                ]
            })
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
                    question_id: question.id,
                    selected_option_id: opt.id,
                    is_correct: opt.isCorrect,
                    is_trap: opt.isTrap || false
                })
            });
            refreshStats(); // Update global stats
        } catch (e) {
            console.error("Failed to submit answer", e);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.textSecondary }}>Generating Logic...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Top Bar */}
            <View style={styles.header}>
                <Text style={[styles.topicBadge, { color: colors.primary, backgroundColor: colors.highlight }]}>
                    {topic.toUpperCase()}
                </Text>
                <View style={styles.timerContainer}>
                    <Clock size={16} color={timer < 10 ? colors.danger : colors.textSecondary} />
                    <Text style={[styles.timerText, { color: timer < 10 ? colors.danger : colors.text }]}>{timer}s</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            backgroundColor: timer < 10 ? colors.danger : colors.primary,
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]}
                />
            </View>

            {/* Question */}
            <View style={styles.qContainer}>
                <Text style={[styles.questionText, { color: colors.text }]}>{question.text}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
                {question.options.map((opt: any) => {
                    let bgColor = colors.card;
                    let borderColor = 'transparent';

                    if (result && opt.id === selectedOpt) {
                        if (result === 'correct') { bgColor = 'rgba(34, 197, 94, 0.2)'; borderColor = colors.success; }
                        else if (result === 'trap') { bgColor = 'rgba(234, 179, 8, 0.2)'; borderColor = colors.warning; }
                        else { bgColor = 'rgba(239, 68, 68, 0.2)'; borderColor = colors.danger; }
                    } else if (result && opt.isCorrect) {
                        bgColor = 'rgba(34, 197, 94, 0.1)'; borderColor = colors.success;
                    }

                    return (
                        <TouchableOpacity
                            key={opt.id}
                            style={[
                                styles.optionBtn,
                                { backgroundColor: bgColor, borderColor: borderColor, borderWidth: 1 }
                            ]}
                            onPress={() => handleSelect(opt)}
                            disabled={!!result}
                        >
                            <Text style={[styles.optionText, { color: colors.text }]}>{opt.text}</Text>
                            {result && opt.id === selectedOpt && (
                                <View>
                                    {result === 'correct' && <CheckCircle size={20} color={colors.success} />}
                                    {result === 'trap' && <AlertTriangle size={20} color={colors.warning} />}
                                    {result === 'wrong' && <XCircle size={20} color={colors.danger} />}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Feedback Modal / Bottom Sheet */}
            {result && (
                <View style={[styles.feedbackContainer, { backgroundColor: colors.card, borderTopColor: colors.highlight }]}>
                    <View style={styles.feedbackHeader}>
                        <Text style={[
                            styles.feedbackTitle,
                            { color: result === 'correct' ? colors.success : result === 'trap' ? colors.warning : colors.danger }
                        ]}>
                            {result === 'correct' ? 'Excellent!' : result === 'trap' ? "It's a Trap!" : 'Incorrect'}
                        </Text>
                    </View>

                    <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
                        {result === 'correct'
                            ? "You identified the correct answer."
                            : (question.options.find((o: any) => o.id === selectedOpt)?.feedback || question.explanation)
                        }
                    </Text>

                    <TouchableOpacity
                        style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                        onPress={fetchQuestion}
                    >
                        <Text style={styles.nextBtnText}>Next Question</Text>
                        <ArrowRight size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        marginLeft: 6,
        fontWeight: 'bold',
        fontSize: 16,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
    qContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
        minHeight: 100,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    optionsContainer: {
        paddingHorizontal: 20,
    },
    optionBtn: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    feedbackContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    feedbackHeader: {
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    feedbackText: {
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    nextBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
    },
});
