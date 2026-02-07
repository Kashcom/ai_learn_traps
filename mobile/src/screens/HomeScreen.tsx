import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Play, TrendingUp, User, Award, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { colors, isDark } = useTheme();
    const { stats, refreshStats } = useUser();
    const navigation = useNavigation<any>();
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        refreshStats();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome Back,</Text>
                        <Text style={[styles.username, { color: colors.text }]}>{stats.name}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.profileBtn, { backgroundColor: colors.card }]}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <User size={24} color={colors.primary} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Stats Card */}
                <View style={[styles.statsCard, { backgroundColor: colors.primary }]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Level</Text>
                        <Text style={styles.statValue}>{stats.level}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>XP</Text>
                        <Text style={styles.statValue}>{stats.xp}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Traps Avoided</Text>
                        <Text style={styles.statValue}>-</Text>
                    </View>
                </View>

                {/* Main Action */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Start Learning</Text>

                <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: colors.card, borderColor: colors.highlight }]}
                    onPress={() => navigation.navigate('BookSelection')}
                >
                    <View style={[styles.iconCircle, { backgroundColor: colors.highlight }]}>
                        <Play fill={colors.primary} color={colors.primary} size={24} />
                    </View>
                    <View style={styles.playContent}>
                        <Text style={[styles.playTitle, { color: colors.text }]}>Select Textbook</Text>
                        <Text style={[styles.playSubtitle, { color: colors.textSecondary }]}>Browse by Class & Chapter</Text>
                    </View>
                    <ArrowRight color={colors.textSecondary} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: colors.card, borderColor: colors.highlight, marginTop: -16 }]}
                    onPress={() => navigation.navigate('TopicSelection')}
                >
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                        <TrendingUp color={colors.warning} size={24} />
                    </View>
                    <View style={styles.playContent}>
                        <Text style={[styles.playTitle, { color: colors.text }]}>Quick Challenge</Text>
                        <Text style={[styles.playSubtitle, { color: colors.textSecondary }]}>Random generated traps</Text>
                    </View>
                    <ArrowRight color={colors.textSecondary} size={20} />
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Progress</Text>
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                    <View style={styles.progressRow}>
                        <View style={[styles.progressIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                            <TrendingUp size={20} color={colors.success} />
                        </View>
                        <View style={styles.progressInfo}>
                            <Text style={[styles.progressTitle, { color: colors.text }]}>Physics Mechanics</Text>
                            <Text style={[styles.progressTime, { color: colors.textSecondary }]}>2 hours ago</Text>
                        </View>
                        <Text style={[styles.progressScore, { color: colors.success }]}>+50 XP</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        fontFamily: 'System',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsCard: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 32,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    playContent: {
        flex: 1,
    },
    playTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    playSubtitle: {
        fontSize: 12,
    },
    progressCard: {
        borderRadius: 16,
        padding: 16,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    progressInfo: {
        flex: 1,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressTime: {
        fontSize: 12,
    },
    progressScore: {
        fontWeight: 'bold',
    },
});
