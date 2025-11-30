import { StyleSheet } from 'react-native';
import { colors } from '../../lib/theme/colors';
import { spacing } from '../../lib/theme/spacing';

export const TEAL_COLOR = colors.teal;

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 40,
    fontFamily: 'CrushedStrike',
    color: colors.white,
    marginBottom: spacing.md,
  },
  heroSubtitleBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.whiteTranslucent,
  },
  searchCardWrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  searchCard: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.cardPadding,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputField: {
    borderRadius: spacing.borderRadius.sm,
    borderWidth: spacing.borderWidth.default,
    paddingHorizontal: spacing.inputPaddingHorizontal,
    paddingTop: spacing.inputPaddingTop,
    paddingBottom: spacing.inputPaddingBottom,
    marginBottom: spacing.md,
  },
  inputFieldNormal: {
    borderColor: colors.gray200,
    backgroundColor: colors.background,
  },
  inputFieldError: {
    borderColor: colors.errorLight,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.errorLight,
    fontSize: 12,
    marginTop: -12,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  fieldLabelNormal: {
    color: colors.gray400,
  },
  fieldLabelError: {
    color: colors.errorLight,
  },
  fieldInput: {
    fontSize: 15,
    padding: spacing.none,
    margin: spacing.none,
    color: colors.gray800,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    color: colors.teal,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: colors.teal,
    borderRadius: spacing.borderRadius.sm,
    paddingVertical: spacing.buttonPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  historySectionWithPadding: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.none,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray800,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionAction: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '500',
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
  arrowButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.cardPadding,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.gray800,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.buttonPaddingVertical,
    marginBottom: spacing.xs,
    backgroundColor: colors.transparent,
  },
  modalOptionSelected: {
    backgroundColor: colors.gray100,
  },
  modalOptionText: {
    fontSize: 15,
    flex: 1,
    color: colors.gray800,
    fontWeight: '400',
  },
  modalOptionTextSelected: {
    color: colors.teal,
    fontWeight: '600',
  },
  radioOuter: {
    width: spacing.radioSize.outer,
    height: spacing.radioSize.outer,
    borderRadius: spacing.radioSize.outer / 2,
    borderWidth: spacing.borderWidth.medium,
    borderColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: colors.teal,
  },
  radioInner: {
    width: spacing.radioSize.inner,
    height: spacing.radioSize.inner,
    borderRadius: spacing.radioSize.inner / 2,
    backgroundColor: colors.teal,
  },
});
