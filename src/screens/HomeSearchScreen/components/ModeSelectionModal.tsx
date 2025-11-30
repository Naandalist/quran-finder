import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';

import { QueryMode } from 'lib/types';
import { styles } from '../styles';
import { MODE_LABELS } from '../hooks';

interface ModeSelectionModalProps {
  visible: boolean;
  currentMode: QueryMode;
  onClose: () => void;
  onSelectMode: (mode: QueryMode) => void;
}

export function ModeSelectionModal({
  visible,
  currentMode,
  onClose,
  onSelectMode,
}: ModeSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={e => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Pilih mode pencarian</Text>
          {(Object.keys(MODE_LABELS) as QueryMode[]).map(modeKey => (
            <TouchableOpacity
              key={modeKey}
              style={[
                styles.modalOption,
                currentMode === modeKey && styles.modalOptionSelected,
              ]}
              onPress={() => onSelectMode(modeKey)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  currentMode === modeKey && styles.modalOptionTextSelected,
                ]}
              >
                {MODE_LABELS[modeKey]}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  currentMode === modeKey && styles.radioOuterSelected,
                ]}
              >
                {currentMode === modeKey && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
