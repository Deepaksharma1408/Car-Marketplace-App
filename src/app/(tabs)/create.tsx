import { useBrandDialog } from '@/components/ui/BrandDialog';
import { TouchableOpacity } from '@/components/ui/Touchable';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { Spacing, Radius } from '@/constants/theme';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const { showDialog, dialog } = useBrandDialog();
  const { colors, isDark } = useAppTheme();
  const [createType, setCreateType] = useState<'sell' | 'social'>('sell');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const paths = [
    {
      id: 'path-a',
      letter: 'A',
      title: 'Ready-Made Video',
      tagline: 'Best for dealers & polished creator edits',
      description:
        'Upload your finished 9:16 vertical showcase video with custom audio and transitions ready to publish.',
      icon: 'film-outline',
      badge: '9:16 Vertical Reel',
      features: ['Up to 60s length', 'Full 4K / 1080p upload', 'Audio normalization', 'Direct AED price tag'],
    },
    {
      id: 'path-b',
      letter: 'B',
      title: 'Raw Clips with Template',
      tagline: 'Fastest way to get high-engagement reels',
      description:
        'Pick 3 to 6 raw phone clips (exhaust, walkaround, interior, wheel spin). Template auto-cuts and syncs specs.',
      icon: 'sparkles-outline',
      badge: 'AI Smart Sync (Planned)',
      features: ['Automated clip sequencing', 'Exhaust note enhancer', 'Animated specs overlay', 'Trending audio sync'],
    },
    {
      id: 'path-c',
      letter: 'C',
      title: 'Photos-Only Listing',
      tagline: 'Classic multi-angle photo walkthrough',
      description:
        'Guided photo tour capturing front 3/4, side profile, cockpit, rear badge, and odometer for buyers who prefer stills.',
      icon: 'camera-outline',
      badge: '12-Photo Guided Tour',
      features: ['Visual angle guide', 'Ghost-overlay alignment', 'VIN barcode scanner', 'Instant valuation estimate'],
    },
  ];

  const handleStartFlow = (title: string) => {
    showDialog(
      `${title} Flow`,
      'This interactive path is part of Stage 1 MVP. In this frontend prototype, upload pipelines, video rendering, and camera integrations are cleanly prepared for full native integration.',
      [{ text: 'Understood', style: 'default' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 16) + 14, paddingBottom: 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerPre, { color: colors.link }]}>VEHICLESPOT STUDIO</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create & Publish</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            Share high-converting vehicle listings or showcase automotive community content across the UAE.
          </Text>
        </View>

        {/* Top 2 Choices Selector */}
        <View style={[styles.typeSelector, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.typeTab,
              createType === 'sell' && [
                styles.typeTabActive,
                { backgroundColor: colors.surface, shadowColor: colors.text },
              ],
            ]}
            onPress={() => setCreateType('sell')}
            accessibilityRole="tab"
            accessibilityState={{ selected: createType === 'sell' }}
            accessibilityLabel="Sell a vehicle tab"
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={createType === 'sell' ? colors.accent : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.typeTabText,
                {
                  color: createType === 'sell' ? colors.link : colors.textSecondary,
                  fontWeight: createType === 'sell' ? '700' : '500',
                },
              ]}
            >
              Sell a Vehicle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              createType === 'social' && [
                styles.typeTabActive,
                { backgroundColor: colors.surface, shadowColor: colors.text },
              ],
            ]}
            onPress={() => setCreateType('social')}
            accessibilityRole="tab"
            accessibilityState={{ selected: createType === 'social' }}
            accessibilityLabel="Post a vehicle video tab"
          >
            <Ionicons
              name="play-circle-outline"
              size={18}
              color={createType === 'social' ? colors.accent : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.typeTabText,
                {
                  color: createType === 'social' ? colors.link : colors.textSecondary,
                  fontWeight: createType === 'social' ? '700' : '500',
                },
              ]}
            >
              Post Vehicle Video
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sell a Vehicle Flows */}
        {createType === 'sell' ? (
          <View style={styles.pathsSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Choose Your Listing Creation Path
              </Text>
              <Text style={[styles.sectionSubheading, { color: colors.textSecondary }]}>
                3 distinct formats tailored for Dubai car sellers
              </Text>
            </View>

            <View style={styles.cardsWrap}>
              {paths.map((p) => {
                const isExpanded = selectedPath === p.id;
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.pathCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isExpanded ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    {/* Path Header */}
                    <TouchableOpacity style={styles.cardHeader} onPress={() => setSelectedPath(isExpanded ? null : p.id)} accessibilityRole="button" accessibilityLabel={`Listing path ${p.title}`} accessibilityState={{ selected: isExpanded }}>
                      <View style={styles.cardHeaderLeft}>
                        <View style={[styles.letterBadge, { backgroundColor: colors.accentLight }]}>
                          <Text style={[styles.letterText, { color: colors.link }]}>{p.letter}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.titleRow}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{p.title}</Text>
                            <View style={[styles.tagBadge, { backgroundColor: colors.goldLight }]}>
                              <Text style={[styles.tagBadgeText, { color: colors.goldText }]}>
                                {p.badge}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.cardTagline, { color: colors.textSecondary }]}>
                            {p.tagline}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Description */}
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                      {p.description}
                    </Text>

                    {/* Features checklist */}
                    <View style={styles.featuresList}>
                      {p.features.map((feat, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
                          <Text style={[styles.featureText, { color: colors.text }]}>{feat}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Start Action */}
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Start Path ${p.letter}: ${p.title}`}
                      style={[
                        styles.startPathBtn,
                        {
                          backgroundColor: isExpanded ? colors.action : colors.surfaceElevated,
                        },
                      ]}
                      onPress={() => handleStartFlow(p.title)}
                    >
                      <Text
                        style={[
                          styles.startPathBtnText,
                          {
                            color: isExpanded
                              ? colors.onAccent
                              : colors.text,
                          },
                        ]}
                      >
                        Start Path {p.letter}: {p.title}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={isExpanded ? colors.onAccent : colors.text}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          /* Post a Vehicle Video (Community Social Content) */
          <View style={[styles.socialSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.socialIconBox, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="videocam" size={36} color={colors.accent} />
            </View>
            <Text style={[styles.socialTitle, { color: colors.text }]}>Community Vehicle Reel</Text>
            <Text style={[styles.socialDesc, { color: colors.textSecondary }]}>
              Post exhaust sound tests, desert dune runs, track day clips, car meet highlights, or garage builds. Non-commercial reels reach automotive fans across the UAE without listing fees.
            </Text>

            <View style={styles.socialGuidelines}>
              <View style={styles.guidelineRow}>
                <Ionicons name="volume-high-outline" size={18} color={colors.accent} />
                <Text style={[styles.guidelineText, { color: colors.text }]}>
                  High-fidelity audio recording enabled
                </Text>
              </View>
              <View style={styles.guidelineRow}>
                <Ionicons name="location-outline" size={18} color={colors.accent} />
                <Text style={[styles.guidelineText, { color: colors.text }]}>
                  Tag famous UAE spots (Jebel Jais, Liwa, Yas Marina, Autodrome)
                </Text>
              </View>
              <View style={styles.guidelineRow}>
                <Ionicons name="chatbubbles-outline" size={18} color={colors.accent} />
                <Text style={[styles.guidelineText, { color: colors.text }]}>
                  Interactive comment discussions with verified gearheads
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.socialCtaBtn, { backgroundColor: colors.action }]}
              onPress={() => handleStartFlow('Community Reel')}
            >
              <Ionicons
                name="videocam"
                size={18}
                color={colors.onAccent}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.socialCtaText, { color: colors.onAccent }]}>
                Select Video from Camera Roll
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Honest Prototype Notice */}
        <View style={[styles.noticeCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} style={{ marginTop: 2 }} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.noticeTitle, { color: colors.text }]}>Frontend Prototype Notice</Text>
            <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
              In this initial discovery foundation, the creation architecture and UI paths are clearly mapped out. Real video compression, cloud uploads, and AI auto-sync will connect in subsequent stages.
            </Text>
          </View>
        </View>
      </ScrollView>
      {dialog}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
  },
  header: {
    marginBottom: Spacing.five,
  },
  headerPre: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: 4,
    borderWidth: 1,
    marginBottom: Spacing.six,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  typeTabActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTabText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  pathsSection: {
    gap: Spacing.four,
    marginBottom: Spacing.six,
  },
  sectionHeadingRow: {
    marginBottom: Spacing.two,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubheading: {
    fontSize: 13,
    marginTop: 2,
  },
  cardsWrap: {
    gap: Spacing.four,
  },
  pathCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1.5,
  },
  cardHeader: {
    marginBottom: Spacing.three,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  letterBadge: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 18,
    fontWeight: '900',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardTagline: {
    fontSize: 12,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  featuresList: {
    gap: 6,
    marginBottom: Spacing.four,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  startPathBtn: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.full,
    gap: 8,
  },
  startPathBtnText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },
  socialSection: {
    borderRadius: Radius.lg,
    padding: Spacing.six,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: Spacing.six,
  },
  socialIconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  socialTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  socialDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.five,
  },
  socialGuidelines: {
    width: '100%',
    gap: Spacing.three,
    marginBottom: Spacing.six,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  guidelineText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  socialCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: Radius.full,
  },
  socialCtaText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
  },
  noticeCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
