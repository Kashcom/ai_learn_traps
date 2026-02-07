import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book, ChevronRight, Filter } from 'lucide-react-native';

export default function BookSelectionScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const API_URL = 'http://10.0.2.2:8000';
            const res = await fetch(`${API_URL}/textbooks`);
            const data = await res.json();
            setBooks(data);
        } catch (e) {
            console.error(e);
            // Mock data for demo if backend is offline or empty
            setBooks([
                { id: '1', title: 'Mathematics', grade: '9', subject: 'Math', board: 'International' },
                { id: '2', title: 'Physics Part 1', grade: '11', subject: 'Physics', board: 'Local' },
                { id: '3', title: 'Biology Essentials', grade: '10', subject: 'Biology', board: 'International' },
                { id: '4', title: 'Chemistry World', grade: '9', subject: 'Chemistry', board: 'Local' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredBooks = selectedClass
        ? books.filter(b => b.grade === selectedClass)
        : books;

    const uniqueClasses = Array.from(new Set(books.map(b => b.grade))).sort();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Select Book</Text>
            </View>

            {/* Class Filter Chips */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity
                        style={[
                            styles.chip,
                            {
                                backgroundColor: !selectedClass ? colors.primary : colors.card,
                                borderColor: colors.border
                            }
                        ]}
                        onPress={() => setSelectedClass(null)}
                    >
                        <Text style={[styles.chipText, { color: !selectedClass ? '#fff' : colors.text }]}>All Classes</Text>
                    </TouchableOpacity>

                    {uniqueClasses.map(cls => (
                        <TouchableOpacity
                            key={cls}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: selectedClass === cls ? colors.primary : colors.card,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setSelectedClass(cls)}
                        >
                            <Text style={[styles.chipText, { color: selectedClass === cls ? '#fff' : colors.text }]}>
                                Class {cls}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    {filteredBooks.length === 0 ? (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No books found.</Text>
                    ) : (
                        filteredBooks.map((book) => (
                            <TouchableOpacity
                                key={book.id}
                                style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.highlight }]}
                                onPress={() => navigation.navigate('ChapterSelection', { bookId: book.id, bookTitle: book.title })}
                            >
                                <View style={[styles.bookIcon, { backgroundColor: colors.highlight }]}>
                                    <Book color={colors.primary} size={28} />
                                </View>
                                <View style={styles.bookInfo}>
                                    <Text style={[styles.bookTitle, { color: colors.text }]}>{book.title}</Text>
                                    <Text style={[styles.bookMeta, { color: colors.textSecondary }]}>
                                        Class {book.grade} • {book.subject}
                                    </Text>
                                    <Text style={[styles.bookBoard, { color: colors.textSecondary }]}>{book.board}</Text>
                                </View>
                                <ChevronRight color={colors.textSecondary} size={24} />
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    filterContainer: {
        paddingVertical: 15,
        borderBottomWidth: 0,
    },
    filterScroll: {
        paddingHorizontal: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    chipText: {
        fontWeight: '600',
    },
    listContent: {
        padding: 20,
    },
    bookCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bookIcon: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bookMeta: {
        fontSize: 14,
        marginBottom: 2,
    },
    bookBoard: {
        fontSize: 12,
        opacity: 0.7,
    },
});
