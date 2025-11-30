import { StyleSheet } from 'react-native';
import { colors } from '../../lib/theme/colors';
import { spacing } from '../../lib/theme/spacing';

export const TEAL_COLOR = colors.teal;

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.teal,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  queryHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: spacing.borderWidth.default,
    borderBottomColor: colors.gray200,
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  queryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  queryMeta: {
    fontSize: 14,
    color: colors.gray500,
  },
  queryMetaSeparator: {
    fontSize: 10,
    color: colors.gray500,
    marginHorizontal: spacing.xs,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  listContentWithPlayer: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.cardPadding,
  },
});
