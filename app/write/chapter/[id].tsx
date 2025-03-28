import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Save,
  Eye,
  MoreVertical,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  CheckSquare,
  Plus,
  Trash2,
  MoveVertical,
  Target,
  Clock,
  X,
  CheckCircle2,
  Timer,
} from "lucide-react-native";

// Types
type BlockType =
  | "paragraph"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "bulleted-list"
  | "numbered-list"
  | "quote"
  | "code"
  | "image"
  | "todo";

type Block = {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
};

type Chapter = {
  id: string;
  projectId: string;
  title: string;
  blocks: Block[];
  status: "Draft" | "Published";
  lastEdited: string;
  wordCount: number;
};

// Mock data for chapters
const chaptersData = {
  ch1: {
    id: "ch1",
    projectId: "p1",
    title: "The Discovery",
    blocks: [
      {
        id: "b1",
        type: "heading-1",
        content: "The Discovery",
      },
      {
        id: "b2",
        type: "paragraph",
        content:
          "I found it in the basement of my grandmother's house, tucked away behind stacks of yellowing newspapers and forgotten holiday decorations. A trapdoor, small and unassuming, its brass handle tarnished with age.",
      },
      {
        id: "b3",
        type: "paragraph",
        content:
          "It took some effort to pull it open – the hinges protesting with a screech that echoed in the musty air. A set of narrow stone steps descended into darkness. I should have been afraid, perhaps, but curiosity has always been my weakness.",
      },
      {
        id: "b4",
        type: "heading-2",
        content: "The Chamber Below",
      },
      {
        id: "b5",
        type: "paragraph",
        content:
          "On the pedestal lay a book, bound in what appeared to be leather, though its texture seemed odd when I finally worked up the courage to touch it. The cover bore no title, only an intricate symbol that seemed to shift slightly when viewed from different angles.",
      },
      {
        id: "b6",
        type: "bulleted-list",
        content:
          "Beside the book was a key – small, made of a metal that gleamed with an almost blue tint.",
      },
      {
        id: "b7",
        type: "bulleted-list",
        content: "It was attached to a chain of the same material.",
      },
      {
        id: "b8",
        type: "paragraph",
        content:
          "The far wall of the chamber held a door – if it could be called that. It was more like a perfect circle carved into the stone, with no visible hinges or handle. In the center was a small keyhole.",
      },
      {
        id: "b9",
        type: "code",
        content:
          "function unlockDoor(key) {\n  if (key.material === 'blue-metal') {\n    return door.open();\n  }\n  return false;\n}",
      },
      {
        id: "b10",
        type: "paragraph",
        content:
          "I hesitated, the rational part of my mind screaming that I should go back upstairs, call someone, report this strange discovery. But a stronger impulse pushed me forward. I picked up the key, surprised by its warmth despite the chilly air, and inserted it into the keyhole.",
      },
      {
        id: "b11",
        type: "todo",
        content: "Remember to describe the sound of the key turning",
        checked: true,
      },
      {
        id: "b12",
        type: "paragraph",
        content:
          "It turned smoothly, and the circular door swung inward without a sound, revealing a tunnel bathed in a soft, blue-green light that seemed to come from the walls themselves.",
      },
    ],
    status: "Published",
    lastEdited: "2023-11-01",
    wordCount: 1890,
  },
  new: {
    id: "new",
    projectId: "", // Will be set based on URL params
    title: "Untitled Chapter",
    blocks: [
      {
        id: "b1",
        type: "paragraph",
        content: "",
      },
    ],
    status: "Draft",
    lastEdited: new Date().toISOString().split("T")[0],
    wordCount: 0,
  },
};

export default function ChapterEditorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [chapterTitle, setChapterTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ x: 0, y: 0 });
  const [showFormatting, setShowFormatting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25); // Default 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // in seconds
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [chapterGoal, setChapterGoal] = useState("1000");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showTimerCompleteModal, setShowTimerCompleteModal] = useState(false);
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);
  const [addBlockMenuIndex, setAddBlockMenuIndex] = useState<number | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Get chapter data based on ID from the URL
  const chapterId = Array.isArray(id) ? id[0] : id;
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;

  // Initialize chapter data
  useEffect(() => {
    if (chapterId === "new") {
      // Creating a new chapter
      setChapterTitle("Untitled Chapter");
      setBlocks([{ id: generateBlockId(), type: "paragraph", content: "" }]);
      setWordCount(0);
    } else {
      // Editing existing chapter
      const chapterData = chaptersData[chapterId as keyof typeof chaptersData];
      if (chapterData) {
        setChapterTitle(chapterData.title);
        setBlocks(chapterData.blocks);
        setWordCount(chapterData.wordCount);
      }
    }
  }, [chapterId]);

  // Generate a unique ID for a new block
  const generateBlockId = () => {
    return "b" + Math.random().toString(36).substring(2, 9);
  };

  // Update word count when blocks change
  useEffect(() => {
    if (blocks.length > 0) {
      const totalContent = blocks.map((block) => block.content).join(" ");
      const words = totalContent.trim().split(/\s+/);
      setWordCount(words.length > 0 && words[0] !== "" ? words.length : 0);
    } else {
      setWordCount(0);
    }
  }, [blocks]);

  // Auto-save functionality
  useEffect(() => {
    if (
      autoSaveEnabled &&
      blocks.some((block) => block.content.trim() !== "")
    ) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }

      autoSaveRef.current = setTimeout(() => {
        // Only auto-save if there's actual content and a title
        if (
          blocks.some((block) => block.content.trim() !== "") &&
          chapterTitle.trim() !== ""
        ) {
          console.log("Auto-saving chapter...");
          // In a real app, this would save to a database
          setLastSaved(new Date());
        }
      }, 30000); // Auto-save after 30 seconds of inactivity
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [blocks, chapterTitle, autoSaveEnabled]);

  // Focus timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            setShowTimerCompleteModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startFocusTimer = () => {
    setTimeRemaining(focusTimer * 60);
    setIsTimerRunning(true);
    setShowFocusMode(false);
  };

  const stopFocusTimer = () => {
    setIsTimerRunning(false);
  };

  const handleBackPress = () => {
    if (blocks.some((block) => block.content.trim() !== "")) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save before leaving?",
        [
          {
            text: "Discard",
            onPress: () => router.back(),
            style: "destructive",
          },
          {
            text: "Save",
            onPress: () => handleSave(true),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      );
    } else {
      router.back();
    }
  };

  const handleSave = (shouldNavigateBack = false) => {
    if (!chapterTitle.trim()) {
      Alert.alert("Error", "Please enter a title for your chapter");
      return;
    }

    setIsSaving(true);

    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      Alert.alert("Success", "Chapter saved successfully");

      // In a real app, this would save the chapter to a database
      console.log({
        id: chapterId,
        projectId,
        title: chapterTitle,
        blocks: blocks,
        wordCount,
      });

      if (shouldNavigateBack) {
        router.back();
      }
    }, 1000);
  };

  const handlePublish = () => {
    if (
      !chapterTitle.trim() ||
      !blocks.some((block) => block.content.trim() !== "")
    ) {
      Alert.alert(
        "Cannot Publish",
        "Please make sure your chapter has both a title and content before publishing.",
      );
      return;
    }

    Alert.alert(
      "Publish Chapter",
      "Are you sure you want to publish this chapter? Published chapters will be visible to readers.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Publish",
          onPress: () => {
            // In a real app, this would update the chapter status in the database
            Alert.alert(
              "Success",
              "Your chapter has been published successfully!",
            );
          },
        },
      ],
    );
  };

  const handleSaveGoal = () => {
    const goalNumber = parseInt(chapterGoal);
    if (isNaN(goalNumber) || goalNumber <= 0) {
      Alert.alert("Invalid Goal", "Please enter a valid number greater than 0");
      return;
    }

    // In a real app, this would save to a database
    setShowGoalModal(false);
    Alert.alert("Success", "Your chapter word count goal has been updated!");
  };

  // Block manipulation functions
  const addBlock = (type: BlockType, index: number) => {
    const newBlock: Block = {
      id: generateBlockId(),
      type,
      content: "",
    };

    if (type === "todo") {
      newBlock.checked = false;
    }

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setShowAddBlockMenu(false);
  };

  const deleteBlock = (id: string) => {
    // Don't delete if it's the only block
    if (blocks.length <= 1) {
      return;
    }

    const newBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(newBlocks);
    setSelectedBlockId(null);
  };

  const updateBlockContent = (id: string, content: string) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block,
    );
    setBlocks(newBlocks);
  };

  const updateBlockType = (id: string, newType: BlockType) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, type: newType } : block,
    );
    setBlocks(newBlocks);
    setShowBlockMenu(false);
  };

  const toggleTodoCheck = (id: string) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, checked: !block.checked } : block,
    );
    setBlocks(newBlocks);
  };

  const moveBlockUp = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index <= 0) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlocks(newBlocks);
  };

  const moveBlockDown = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index >= blocks.length - 1) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlocks(newBlocks);
  };

  const handleKeyPress = (e: any, blockId: string, index: number) => {
    // Handle Enter key to create a new block
    if (e.nativeEvent.key === "Enter") {
      e.preventDefault();
      addBlock("paragraph", index);
    }

    // Handle Backspace on empty block to delete it
    if (e.nativeEvent.key === "Backspace") {
      const block = blocks.find((b) => b.id === blockId);
      if (block && block.content === "" && blocks.length > 1) {
        deleteBlock(blockId);

        // Select the previous block if available
        const prevIndex = index - 1;
        if (prevIndex >= 0) {
          setSelectedBlockId(blocks[prevIndex].id);
        }
      }
    }
  };

  const showBlockTypeMenu = (blockId: string, x: number, y: number) => {
    setSelectedBlockId(blockId);
    setBlockMenuPosition({ x, y });
    setShowBlockMenu(true);
  };

  const showAddBlockMenuAt = (index: number) => {
    setAddBlockMenuIndex(index);
    setShowAddBlockMenu(true);
  };

  // Render block based on its type
  const renderBlock = (block: Block, index: number, isPreview: boolean) => {
    const isSelected = selectedBlockId === block.id && !isPreview;

    const blockStyles = {
      paragraph: "text-base leading-6 mb-4",
      "heading-1": "text-3xl font-bold mb-4",
      "heading-2": "text-2xl font-bold mb-3",
      "heading-3": "text-xl font-bold mb-2",
      "bulleted-list": "text-base leading-6 mb-1 pl-4 flex flex-row",
      "numbered-list": "text-base leading-6 mb-1 pl-4 flex flex-row",
      quote: "text-base italic border-l-4 border-gray-300 pl-4 py-1 mb-4",
      code: "font-mono text-sm bg-gray-100 p-3 rounded mb-4",
      image: "mb-4",
      todo: "flex flex-row items-start mb-2",
    };

    // Common wrapper for all block types in edit mode
    const BlockWrapper = ({ children }: { children: React.ReactNode }) => (
      <View className={`relative ${isSelected ? "bg-blue-50 rounded" : ""}`}>
        {!isPreview && (
          <View className="absolute left-[-30px] top-2 flex flex-row items-center">
            <TouchableOpacity
              onPress={() => showAddBlockMenuAt(index)}
              className="w-6 h-6 justify-center items-center"
            >
              <Plus size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}
        {children}
        {isSelected && !isPreview && (
          <TouchableOpacity
            className="absolute right-[-30px] top-2"
            onPress={(e) => showBlockTypeMenu(block.id, 0, 0)}
          >
            <MoreVertical size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    );

    if (isPreview) {
      // Preview mode rendering
      switch (block.type) {
        case "paragraph":
          return (
            <Text key={block.id} className={blockStyles.paragraph}>
              {block.content}
            </Text>
          );
        case "heading-1":
          return (
            <Text key={block.id} className={blockStyles["heading-1"]}>
              {block.content}
            </Text>
          );
        case "heading-2":
          return (
            <Text key={block.id} className={blockStyles["heading-2"]}>
              {block.content}
            </Text>
          );
        case "heading-3":
          return (
            <Text key={block.id} className={blockStyles["heading-3"]}>
              {block.content}
            </Text>
          );
        case "bulleted-list":
          return (
            <View key={block.id} className={blockStyles["bulleted-list"]}>
              <Text className="mr-2">•</Text>
              <Text>{block.content}</Text>
            </View>
          );
        case "numbered-list":
          return (
            <View key={block.id} className={blockStyles["numbered-list"]}>
              <Text className="mr-2">{index + 1}.</Text>
              <Text>{block.content}</Text>
            </View>
          );
        case "quote":
          return (
            <Text key={block.id} className={blockStyles.quote}>
              {block.content}
            </Text>
          );
        case "code":
          return (
            <Text key={block.id} className={blockStyles.code}>
              {block.content}
            </Text>
          );
        case "todo":
          return (
            <View key={block.id} className={blockStyles.todo}>
              <Text className="mr-2">{block.checked ? "☑" : "☐"}</Text>
              <Text>{block.content}</Text>
            </View>
          );
        default:
          return <Text key={block.id}>{block.content}</Text>;
      }
    } else {
      // Edit mode rendering
      switch (block.type) {
        case "paragraph":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Type paragraph text here..."
                multiline
                className={blockStyles.paragraph}
                textAlignVertical="top"
              />
            </BlockWrapper>
          );
        case "heading-1":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Heading 1"
                className={blockStyles["heading-1"]}
              />
            </BlockWrapper>
          );
        case "heading-2":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Heading 2"
                className={blockStyles["heading-2"]}
              />
            </BlockWrapper>
          );
        case "heading-3":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Heading 3"
                className={blockStyles["heading-3"]}
              />
            </BlockWrapper>
          );
        case "bulleted-list":
          return (
            <BlockWrapper key={block.id}>
              <View className={blockStyles["bulleted-list"]}>
                <Text className="mr-2 mt-1">•</Text>
                <TextInput
                  value={block.content}
                  onChangeText={(text) => updateBlockContent(block.id, text)}
                  onFocus={() => setSelectedBlockId(block.id)}
                  onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                  placeholder="List item"
                  multiline
                  className="flex-1"
                />
              </View>
            </BlockWrapper>
          );
        case "numbered-list":
          return (
            <BlockWrapper key={block.id}>
              <View className={blockStyles["numbered-list"]}>
                <Text className="mr-2 mt-1">{index + 1}.</Text>
                <TextInput
                  value={block.content}
                  onChangeText={(text) => updateBlockContent(block.id, text)}
                  onFocus={() => setSelectedBlockId(block.id)}
                  onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                  placeholder="List item"
                  multiline
                  className="flex-1"
                />
              </View>
            </BlockWrapper>
          );
        case "quote":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Quote text"
                multiline
                className={blockStyles.quote}
              />
            </BlockWrapper>
          );
        case "code":
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Code block"
                multiline
                className={blockStyles.code}
              />
            </BlockWrapper>
          );
        case "todo":
          return (
            <BlockWrapper key={block.id}>
              <View className={blockStyles.todo}>
                <TouchableOpacity
                  onPress={() => toggleTodoCheck(block.id)}
                  className="mr-2 mt-1"
                >
                  {block.checked ? (
                    <CheckSquare size={18} color="#4F46E5" />
                  ) : (
                    <View className="w-[18px] h-[18px] border border-gray-400 rounded" />
                  )}
                </TouchableOpacity>
                <TextInput
                  value={block.content}
                  onChangeText={(text) => updateBlockContent(block.id, text)}
                  onFocus={() => setSelectedBlockId(block.id)}
                  onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                  placeholder="To-do item"
                  multiline
                  className="flex-1"
                />
              </View>
            </BlockWrapper>
          );
        default:
          return (
            <BlockWrapper key={block.id}>
              <TextInput
                value={block.content}
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onFocus={() => setSelectedBlockId(block.id)}
                onKeyPress={(e) => handleKeyPress(e, block.id, index)}
                placeholder="Type here..."
                multiline
                className="text-base mb-4"
              />
            </BlockWrapper>
          );
      }
    }
  };

  // Calculate progress toward goal
  const goalNumber = parseInt(chapterGoal);
  const goalProgress = isNaN(goalNumber)
    ? 0
    : Math.min(Math.round((wordCount / goalNumber) * 100), 100);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row space-x-4">
          {isTimerRunning && (
            <View className="flex-row items-center bg-primary-100 px-3 py-1 rounded-full mr-2">
              <Timer size={16} color="#4F46E5" />
              <Text className="text-primary-700 ml-1 font-medium">
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleSave()}
            disabled={isSaving}
            className={`${isSaving ? "opacity-50" : ""}`}
          >
            <Save size={24} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsPreview(!isPreview)}>
            <Eye size={24} color={isPreview ? "#4F46E5" : "#000000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFormatting(!showFormatting)}>
            <MoreVertical size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Block formatting toolbar */}
      {showFormatting && selectedBlockId && (
        <View className="flex-row justify-around items-center p-2 bg-gray-100 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "paragraph")}
            className="p-2"
          >
            <Text className="font-medium text-primary-600">Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "heading-1")}
            className="p-2"
          >
            <Heading1 size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "heading-2")}
            className="p-2"
          >
            <Heading2 size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "bulleted-list")}
            className="p-2"
          >
            <List size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "numbered-list")}
            className="p-2"
          >
            <ListOrdered size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "quote")}
            className="p-2"
          >
            <Quote size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "code")}
            className="p-2"
          >
            <Code size={20} color="#4F46E5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateBlockType(selectedBlockId, "todo")}
            className="p-2"
          >
            <CheckSquare size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {isPreview ? (
          <ScrollView className="flex-1 p-4">
            <Text className="text-2xl font-bold text-center mb-6">
              {chapterTitle}
            </Text>
            <View>
              {blocks.map((block, index) => renderBlock(block, index, true))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView className="flex-1">
            <View className="p-4">
              <TextInput
                value={chapterTitle}
                onChangeText={setChapterTitle}
                placeholder="Chapter Title"
                className="text-2xl font-bold text-center mb-6"
                maxLength={100}
              />
              <View className="pl-8">
                {blocks.map((block, index) => renderBlock(block, index, false))}

                {/* Add block button at the end */}
                <TouchableOpacity
                  onPress={() => showAddBlockMenuAt(blocks.length - 1)}
                  className="flex-row items-center justify-center py-2 my-2 border border-dashed border-gray-300 rounded-lg"
                >
                  <Plus size={16} color="#6B7280" />
                  <Text className="text-gray-500 ml-2">Add block</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Block Type Menu */}
        {showBlockMenu && (
          <View className="absolute top-1/4 left-1/4 bg-white rounded-lg shadow-xl z-10 w-64">
            <View className="p-2 border-b border-gray-200">
              <Text className="font-medium">Change block type</Text>
            </View>
            <ScrollView className="max-h-80">
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "paragraph")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Text className="text-lg ml-2">Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "heading-1")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading1 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "heading-2")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading2 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "heading-3")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading3 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  updateBlockType(selectedBlockId!, "bulleted-list")
                }
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <List size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Bullet List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  updateBlockType(selectedBlockId!, "numbered-list")
                }
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <ListOrdered size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Numbered List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "quote")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Quote size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "code")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Code size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateBlockType(selectedBlockId!, "todo")}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <CheckSquare size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">To-do</Text>
              </TouchableOpacity>

              <View className="border-t border-gray-200 mt-2">
                <TouchableOpacity
                  onPress={() => moveBlockUp(selectedBlockId!)}
                  className="flex-row items-center p-3 hover:bg-gray-100"
                >
                  <MoveVertical size={18} color="#4F46E5" />
                  <Text className="text-lg ml-2">Move Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => moveBlockDown(selectedBlockId!)}
                  className="flex-row items-center p-3 hover:bg-gray-100"
                >
                  <MoveVertical size={18} color="#4F46E5" />
                  <Text className="text-lg ml-2">Move Down</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteBlock(selectedBlockId!)}
                  className="flex-row items-center p-3 hover:bg-gray-100"
                >
                  <Trash2 size={18} color="#EF4444" />
                  <Text className="text-lg ml-2 text-red-500">Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowBlockMenu(false)}
              className="p-3 border-t border-gray-200"
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Block Menu */}
        {showAddBlockMenu && addBlockMenuIndex !== null && (
          <View className="absolute top-1/4 left-1/4 bg-white rounded-lg shadow-xl z-10 w-64">
            <View className="p-2 border-b border-gray-200">
              <Text className="font-medium">Add a block</Text>
            </View>
            <ScrollView className="max-h-80">
              <TouchableOpacity
                onPress={() => addBlock("paragraph", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Text className="text-lg ml-2">Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("heading-1", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading1 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("heading-2", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading2 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("heading-3", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Heading3 size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Heading 3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("bulleted-list", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <List size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Bullet List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("numbered-list", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <ListOrdered size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Numbered List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("quote", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Quote size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("code", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <Code size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addBlock("todo", addBlockMenuIndex)}
                className="flex-row items-center p-3 hover:bg-gray-100"
              >
                <CheckSquare size={18} color="#4F46E5" />
                <Text className="text-lg ml-2">To-do</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowAddBlockMenu(false)}
              className="p-3 border-t border-gray-200"
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom bar with word count and publish button */}
        <View className="border-t border-gray-200 bg-white">
          {/* Word count goal progress */}
          <View className="px-4 pt-2">
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center">
                <Target size={14} color="#4F46E5" />
                <Text className="text-xs text-gray-600 ml-1">
                  Goal: {wordCount}/{chapterGoal} words ({goalProgress}%)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowGoalModal(true)}>
                <Text className="text-xs text-primary-600">Edit Goal</Text>
              </TouchableOpacity>
            </View>
            <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
              <View
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${goalProgress}%` }}
              />
            </View>
          </View>

          {/* Last saved indicator */}
          {lastSaved && (
            <View className="px-4 pb-1">
              <Text className="text-xs text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View className="flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <Text className="text-gray-500 mr-3">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowFocusMode(true)}
                className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
              >
                <Clock size={14} color="#4F46E5" />
                <Text className="text-primary-700 text-xs font-medium ml-1">
                  {isTimerRunning ? "Stop" : "Focus Mode"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handlePublish}
              className="bg-primary-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Focus Mode Modal */}
      <Modal
        visible={showFocusMode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFocusMode(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Focus Mode
              </Text>
              <TouchableOpacity onPress={() => setShowFocusMode(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Focus mode helps you concentrate on writing without distractions.
              Set a timer and start writing!
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2">
                Focus Duration (minutes)
              </Text>
              <View className="flex-row justify-between">
                {[15, 25, 30, 45, 60].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => setFocusTimer(duration)}
                    className={`px-3 py-2 rounded-lg ${focusTimer === duration ? "bg-primary-100 border border-primary-300" : "bg-gray-100"}`}
                  >
                    <Text
                      className={
                        focusTimer === duration
                          ? "text-primary-700 font-medium"
                          : "text-gray-700"
                      }
                    >
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={startFocusTimer}
              className="bg-primary-600 py-3 rounded-lg mb-2"
            >
              <Text className="text-white font-bold text-center">
                Start Focus Timer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFocusMode(false)}
              className="py-2"
            >
              <Text className="text-gray-600 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Set Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Set Chapter Goal
              </Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Setting a word count goal for this chapter helps track your
              progress.
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Word Count Goal</Text>
              <TextInput
                value={chapterGoal}
                onChangeText={setChapterGoal}
                keyboardType="number-pad"
                className="border border-gray-300 rounded-lg p-3 text-base"
                placeholder="Enter your word count goal"
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveGoal}
              className="bg-primary-600 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                Save Goal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Timer Complete Modal */}
      <Modal
        visible={showTimerCompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimerCompleteModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-xl p-5">
            <View className="items-center mb-4">
              <CheckCircle2 size={48} color="#4F46E5" />
              <Text className="text-xl font-bold text-gray-800 mt-2">
                Focus Session Complete!
              </Text>
            </View>

            <Text className="text-gray-600 mb-4 text-center">
              Great job! You've completed your focus session. You wrote{" "}
              {wordCount - (parseInt(chapterGoal) || 0)} words during this
              session.
            </Text>

            <TouchableOpacity
              onPress={() => setShowTimerCompleteModal(false)}
              className="bg-primary-600 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                Continue Writing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Saving indicator */}
      {isSaving && (
        <View className="absolute inset-0 bg-black/10 justify-center items-center">
          <View className="bg-white p-4 rounded-xl shadow-lg">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-700 mt-2">Saving...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
