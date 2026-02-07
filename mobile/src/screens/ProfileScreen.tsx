import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Award, Target, Zap, ChevronRight, Moon, Sun } from 'lucide-react-native';

export default function ProfileScreen() {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                        <Text style={{ fontSize: 32 }}>🎓</Text>
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>Student</Text>
                    <Text style={[styles.level, { color: colors.textSecondary }]}>Level 5 Scholar</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.grid}>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                        <Zap color={colors.warning} size={24} />
                        <Text style={[styles.statVal, { color: colors.text }]}>2,450</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total XP</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                        <Trophy color={colors.primary} size={24} />
                        <Text style={[styles.statVal, { color: colors.text }]}>#12</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                        <Target color={colors.success} size={24} />
                        <Text style={[styles.statVal, { color: colors.text }]}>85%</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
                    </View>
                </View>

                {/* Badges */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
                    <View style={[styles.badgeCard, { backgroundColor: colors.card }]}>
                        <Text style={styles.badgeEmoji}>🦅</Text>
                        <Text style={[styles.badgeName, { color: colors.text }]}>Sharp Eye</Text>
                    </View>
                    <View style={[styles.badgeCard, { backgroundColor: colors.card }]}>
                        <Text style={styles.badgeEmoji}>💡</Text>
                        <Text style={[styles.badgeName, { color: colors.text }]}>Insightful</Text>
                    </View>
                    <View style={[styles.badgeCard, { backgroundColor: colors.card, opacity: 0.5 }]}>
                        <Text style={styles.badgeEmoji}>🔒</Text>
                        <Text style={[styles.badgeName, { color: colors.text }]}>Locked</Text>
                    </View>
                </ScrollView>

                {/* Settings */}
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Settings</Text>

                <View style={[styles.row, { backgroundColor: colors.card }]}>
                    <View style={styles.rowLeft}>
                        {isDark ? <Moon size={20} color={colors.text} /> : <Sun size={20} color={colors.text} />}
                        <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.primary }}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    level: {
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: '31%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    badgesScroll: {
        flexDirection: 'row',
    },
    badgeCard: {
        width: 100,
        height: 100,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    badgeEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    badgeName: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLabel: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
});
