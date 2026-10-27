import { TouchableOpacity } from '@/components/ui/Touchable';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Comment, Vehicle } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { Spacing, Radius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CommentsSheetProps {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export function CommentsSheet({ visible, onClose, vehicle }: CommentsSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [comments, setComments] = useState<Comment[]>(vehicle.sampleComments || [
    {
      id: 'default-1',
      userName: 'Tariq Al Mansoor',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      userHandle: 'tariq_dxb',
      isVerified: true,
      text: 'Insane spec! Is this available for viewing at the showroom?',
      timestamp: '2h ago',
      likes: 12,
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const item: Comment = {
      id: Date.now().toString(),
      userName: 'Rashid Al Nuaimi',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userHandle: 'rashid_dxb',
      isVerified: true,
      text: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setComments([item, ...comments]);
    setNewComment('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheetContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Comments ({comments.length})</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated }]}
              accessibilityLabel="Close comments"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Comment list */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={{ uri: item.userAvatar }} style={styles.avatar} contentFit="cover" />
                <View style={styles.commentBody}>
                  <View style={styles.authorRow}>
                    <Text style={[styles.authorName, { color: colors.text }]}>{item.userName}</Text>
                    {item.isVerified && (
                      <Ionicons name="checkmark-circle" size={14} color={colors.verified} style={{ marginLeft: 3 }} />
                    )}
                    <Text style={[styles.timestamp, { color: colors.textMuted }]}>{item.timestamp}</Text>
                  </View>
                  <Text style={[styles.commentText, { color: colors.textSecondary }]}>{item.text}</Text>
                </View>
                <TouchableOpacity style={styles.likeBtn}>
                  <Ionicons name="heart-outline" size={16} color={colors.textMuted} />
                  {item.likes > 0 && (
                    <Text style={[styles.commentLikes, { color: colors.textMuted }]}>{item.likes}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No comments yet. Start the conversation!
                </Text>
              </View>
            }
          />

          {/* Input bar */}
          <View style={[styles.inputContainer, {
            borderTopColor: colors.borderSubtle,
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, Spacing.three),
            paddingLeft: Math.max(insets.left, Spacing.four),
            paddingRight: Math.max(insets.right, Spacing.four),
          }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  color: colors.text,
                  borderColor: inputFocused ? colors.accent : colors.border,
                },
              ]}
              accessibilityLabel="Comment text"
              placeholder="Add a comment for this vehicle..."
              placeholderTextColor={colors.textMuted}
              value={newComment}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChangeText={setNewComment}
              returnKeyType="send"
              onSubmitEditing={handleAddComment}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: newComment.trim() ? colors.action : colors.surfaceElevated,
                  opacity: newComment.trim() ? 1 : 0.6,
                },
              ]}
              disabled={!newComment.trim()}
              onPress={handleAddComment}
              accessibilityLabel="Send comment"
              accessibilityRole="button"
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={newComment.trim() ? colors.onAccent : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
  },
  sheetContainer: {
    height: '72%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
  },
  commentBody: {
    flex: 1,
  },
  authorRow: {
    flexWrap: 'wrap',
    rowGap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 11,
    marginLeft: Spacing.two,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  likeBtn: {
    alignItems: 'center',
    paddingTop: 4,
  },
  commentLikes: {
    fontSize: 10,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.eight,
  },
  emptyText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    fontSize: 14,
    borderWidth: 1,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
