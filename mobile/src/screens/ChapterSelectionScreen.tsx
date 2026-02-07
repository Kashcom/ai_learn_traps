import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BookOpen, Clock, Activity } from 'lucide-react-native';

export default function ChapterSelectionScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { bookId, bookTitle } = route.params;

    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            const API_URL = 'http://10.0.2.2:8000';
            const res = await fetch(`${API_URL}/textbooks/${bookId}/chapters`);
            const data = await res.json();
            setChapters(data);
        } catch (e) {
            console.error(e);
            // Mock data
            setChapters([
                { id: '1', title: 'Chapter 1: Algebra Basics', chapter_number: 1 },
                { id: '2', title: 'Chapter 2: Trigonometry', chapter_number: 2 },
                { id: '3', title: 'Chapter 3: Calculus I', chapter_number: 3 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{bookTitle}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    {chapters.length === 0 ? (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No chapters found.</Text>
                    ) : (
                        chapters.map((chapter) => (
                            <TouchableOpacity
                                key={chapter.id}
                                style={[styles.chapterCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => navigation.navigate('Game', { chapterId: chapter.id, chapterTitle: chapter.title })}
                            >
                                <View style={[styles.numberCircle, { backgroundColor: colors.highlight }]}>
                                    <Text style={[styles.numberText, { color: colors.primary }]}>{chapter.chapter_number}</Text>
                                </View>
                                <View style={styles.chapterInfo}>
                                    <Text style={[styles.chapterTitle, { color: colors.text }]}>{chapter.title}</Text>
                                    <View style={styles.metrics}>
                                        <View style={styles.metricItem}>
                                            <Activity size={14} color={colors.warning} />
                                            <Text style={[styles.metricText, { color: colors.textSecondary }]}>Easy</Text>
                                        </View>
                                        <View style={styles.metricItem}>
                                            <Clock size={14} color={colors.textSecondary} />
                                            <Text style={[styles.metricText, { color: colors.textSecondary }]}>~5m</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backBtn: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    listContent: {
        padding: 20,
    },
    chapterCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    numberCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    numberText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    chapterInfo: {
        flex: 1,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    metrics: {
        flexDirection: 'row',
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metricText: {
        fontSize: 12,
        marginLeft: 4,
    },
});
