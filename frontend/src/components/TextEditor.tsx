/**
 * TextEditor Component
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  editable?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onTextChange,
  editable = true
}) => {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Extracted Text</Text>
        <Text style={styles.wordCount}>{wordCount} words</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {editable ? 'Review and edit the extracted text before generating audio' : 'Text content'}
      </Text>

      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          value={text}
          onChangeText={onTextChange}
          editable={editable}
          placeholder="Extracted text will appear here..."
          placeholderTextColor="#999"
          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    maxHeight: 400
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  scrollContainer: {
    maxHeight: 300
  },
  textInput: {
    padding: 20,
    paddingTop: 0,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    minHeight: 200
  }
});
