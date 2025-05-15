// components/ui/MediaCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import theme, { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Assuming you have this

interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  onPress?: () => void;
  // For service-specific icons or tags
  serviceIconName?: React.ComponentProps<typeof Ionicons>['name'];
  serviceIconColor?: string;
  tags?: string[];
  footerText?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  onPress,
  serviceIconName,
  serviceIconColor = Colors.grayMedium,
  tags,
  footerText,
}) => {
  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} disabled={!onPress} activeOpacity={onPress ? 0.7 : 1}>
      {hasImage && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={[styles.content, !hasImage && styles.contentNoImage]}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {serviceIconName && (
            <Ionicons name={serviceIconName} size={FontSizes.xl} color={serviceIconColor} style={styles.serviceIcon} />
          )}
        </View>
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        {footerText && <Text style={styles.footerText}>{footerText}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    marginBottom: Spacing.lg,
    overflow: 'hidden', // Ensures image corners are rounded if image is first child
  },
  image: {
    width: '100%',
    height: 180, // Or make this dynamic/configurable
    backgroundColor: Colors.grayLighter, // Placeholder color
  },
  content: {
    padding: Spacing.cardPadding,
  },
  contentNoImage: {
    // Adjust padding or styles if there's no image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    flex: 1, // Allows text to take space and wrap
    // fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    // fontFamily: Fonts.regular,
  },
  serviceIcon: {
    marginLeft: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tagText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.sm,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textLighter,
    marginTop: Spacing.md,
    textAlign: 'right',
  },
});

export default MediaCard;