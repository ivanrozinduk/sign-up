// send me full code 
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Book, PenLine, BookOpen, Tag } from 'lucide-react';
import { format } from 'date-fns';
import JournalPromptSelector from './JournalPromptSelector';
import JournalTheory from './JournalTheory';
import JournalManager from './JournalManager';

export default function JournalEditor() {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [tags, setTags] = useState<string[]>([]); // TODO: Remove tags
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    /* TODO: Implement save functionality
    key animation improvements:

Save Confirmation:
Smooth fade-in/out with scale effect
Green checkmark icon that pops in with a delay
Auto-dismisses after 2 seconds
Entry List:
Staggered fade-in for entries using Framer Motion's container variants
Scale animation for tags
Smooth hover transitions on cards
Abbility to save and edit notes like in notion
Editor UI:
Animated prompts panel expansion/collapse
Tag addition/removal animations*/
    console.log('Saving journal entry:', { content, tags });
  };

  const handlePromptSelect = (prompt: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt);
    setShowPrompts(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags(prev => [...new Set([...prev, newTag.trim()])]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Journal Entry</h2>
            <p className="text-sm text-gray-600">{format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowManager(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Book className="w-4 h-4" />
              <span>View Entries</span> // add 5 test notes 
            </button>
            <button
              onClick={() => setShowTheory(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn Theory</span>
            </button>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {isPreview ? (
                <>
                  <PenLine className="w-4 h-4" />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Book className="w-4 h-4" />
                  <span>Preview</span>
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <div className="flex-1 flex flex-wrap gap-2 items-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags..."
                className="flex-1 min-w-[120px] border-none focus:ring-0 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Prompt Selector */}
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="w-full mb-6 p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-300"
        >
          Choose a prompt to get started...
        </button>

        {showPrompts && (
          <div className="mb-6">
            <JournalPromptSelector onSelectPrompt={handlePromptSelect} />
          </div>
        )}

        {/* Editor/Preview */}
        <div className="min-h-[400px]">
          {isPreview ? (
            <div className="prose max-w-none p-4 bg-gray-50 rounded-lg min-h-[400px]">
              <ReactMarkdown>{content || '*No content yet...*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full h-[400px] p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          )}
        </div>
      </div>

      {showTheory && <JournalTheory onClose={() => setShowTheory(false)} />}
      {showManager && <JournalManager />}
    </div>
  );
}