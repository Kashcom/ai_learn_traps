import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code, Atom, BookOpen, Globe } from 'lucide-react-native';

const TOPICS = [
    { id: 'math', name: 'Mathematics', icon: BookOpen, color: '#8b5cf6' },
    { id: 'science', name: 'Physics & Science', icon: Atom, color: '#06b6d4' },
    { id: 'cs', name: 'Computer Science', icon: Code, color: '#ec4899' },
    { id: 'history', name: 'History', icon: Globe, color: '#f59e0b' },
];

export default function TopicSelectionScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();

    const renderItem = ({ item }: { item: typeof TOPICS[0] }) => {
        const Icon = item.icon;
        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('Game', { topic: item.id })}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                    <Icon size={32} color={item.color} />
                </View>
                <Text style={[styles.topicName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.topicDesc, { color: colors.textSecondary }]}>Master concepts & avoid traps</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Choose Topic</Text>

            <FlatList
                data={TOPICS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    list: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    topicName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    topicDesc: {
        fontSize: 10,
        textAlign: 'center',
    },
});
