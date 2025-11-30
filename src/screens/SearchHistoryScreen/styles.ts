import { StyleSheet } from 'react-native';
import { colors } from '../../lib/theme/colors';
import { spacing } from '../../lib/theme/spacing';

export const TEAL_COLOR = colors.teal;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: spacing.borderWidth.default,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray800,
  },
  clearAllText: {
    fontSize: 14,
    color: colors.errorLight,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.borderRadius.sm,
    borderWidth: spacing.borderWidth.default,
    borderColor: colors.gray200,
    borderLeftWidth: spacing.borderWidth.thick,
    borderLeftColor: colors.teal,
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyQuery: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing['2xs'],
    color: colors.gray800,
  },
  historyMode: {
    fontSize: 13,
    color: colors.gray400,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.gray400,
  },
});
