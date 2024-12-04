import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { EditorHeader } from './EditorHeader';
import { JournalPromptSelector } from './JournalPromptSelector';
import { JournalTheory } from './JournalTheory';
import { useNoteStore } from '../store/useNoteStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Plus, Maximize2, Minimize2 } from 'lucide-react';

export const JournalEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [title, setTitle] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { addNote, activeNoteId } = useNoteStore();

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    addNote({
      title: title.trim(),
      content,
      emoji: selectedEmoji,
      parentId: activeNoteId,
    });

    // Reset form
    setTitle('');
    setContent('');
    setSelectedEmoji('📝');
  }, [title, content, selectedEmoji, activeNoteId, addNote]);

  const handlePromptSelect = (prompt: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt);
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  useKeyboardShortcuts({
    onNewNote: () => {
      setTitle('');
      setContent('');
      setSelectedEmoji('📝');
    },
    onFullScreen: toggleFullScreen,
  });

  const editorClasses = `
    transition-all duration-300 ease-in-out
    ${isFullScreen ? 'fixed inset-0 z-50 bg-white p-6' : 'relative'}
  `;

  return (
    <div className={editorClasses}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <EditorHeader
          title={title}
          selectedEmoji={selectedEmoji}
          showEmojiPicker={showEmojiPicker}
          onTitleChange={setTitle}
          onEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
          onEmojiSelect={setSelectedEmoji}
          onEmojiPickerClose={() => setShowEmojiPicker(false)}
          onTheoryToggle={() => setShowTheory(true)}
          onSave={handleSave}
          onFullScreenToggle={toggleFullScreen}
          isFullScreen={isFullScreen}
        />

        <button
          onClick={() => setShowPrompts(true)}
          className="w-full mb-6 p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-300"
        >
          Prompts
        </button>

        <div className="min-h-[400px] relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="w-full h-[400px] p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {activeNoteId && (
            <button
              onClick={() => addNote({ title: 'New Note', content: '', emoji: '📝', parentId: activeNoteId })}
              className="absolute bottom-4 right-4 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg"
              title="Add nested note"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showPrompts && (
        <JournalPromptSelector
          onSelectPrompt={handlePromptSelect}
          onClose={() => setShowPrompts(false)}
        />
      )}
      {showTheory && <JournalTheory onClose={() => setShowTheory(false)} />}
    </div>
  );
};
