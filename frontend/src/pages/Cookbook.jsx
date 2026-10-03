import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiHeart, FiClock, FiUsers, FiAlertTriangle, FiCheckCircle, FiChevronRight, FiX, FiPlay, FiMoreHorizontal, FiEdit2, FiTrash2, FiPlus, FiSave, FiImage, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialRecipes = [
  {
    id: 1,
    title: 'Lemon Herb Butter Salmon',
    variation: 'American', flag: 'us',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
    time: '25 min',
    minutes: 25,
    difficulty: 'Easy',
    categories: ['High Protein', 'Keto Approved'],
    matchScore: 98,
    matchedFor: ['Maya', 'David'],
    warnings: [],
    aiModifications: '10-Year Log Adjustments: Maya\'s aversion to cilantro is strictly enforced here; the system swapped in flat-leaf parsley. Because David requires high protein after his evening runs, we increased his salmon portion by 4oz. The butter sauce was kept light to align with Maya\'s weekday low-carb goals, but flavor-maximized using extra garlic.',
    ingredients: ['2 Salmon Fillets (6oz)', '1 Extra Salmon Fillet (4oz - David)', '2 tbsp Ghee (Dairy-Free sub for Elena)', '1 Lemon (Zested & Juiced)', 'Fresh Flat-Leaf Parsley (Cilantro Sub)', '4 Cloves Garlic', '1 lb Asparagus'],
    instructions: [
      'Preheat the smart oven to 400°F (200°C) - [Syncing with Oven Profile]',
      'Place all salmon fillets and asparagus evenly on a large baking sheet.',
      'In a small bowl, melt the ghee. Whisk vigorously with minced garlic, lemon zest, lemon juice, and chopped parsley.',
      'Drizzle the butter mixture generously over the salmon and asparagus.',
      'Bake for 12-15 minutes. Ensure David\'s larger portion reaches a safe internal temp of 145°F.',
      'Serve immediately, keeping portions distinct as per household dietary maps.'
    ],
    availableVariations: [
      {
        variation: 'American', flag: 'us',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
        time: '25 min', difficulty: 'Easy',
        aiModifications: '10-Year Log Adjustments: Maya\'s aversion to cilantro is strictly enforced here.',
        ingredients: ['2 Salmon Fillets (6oz)', '2 tbsp Ghee', '1 Lemon', 'Fresh Flat-Leaf Parsley', '4 Cloves Garlic', '1 lb Asparagus'],
        instructions: ['Preheat oven to 400°F', 'Bake for 12-15 minutes.']
      },
      {
        variation: 'Japanese', flag: 'jp',
        image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=600',
        time: '25 min', difficulty: 'Easy',
        aiModifications: '10-Year Log Adjustments: Replaced butter/lemon profile with a light, low-sodium teriyaki glaze.',
        ingredients: ['2 Salmon Fillets (6oz)', '1/4 cup Low-Sodium Soy Sauce', '1 tbsp Mirin', '1 tbsp Honey', 'Bok Choy', 'Sesame Seeds'],
        instructions: ['Whisk soy sauce, mirin, and honey to create the glaze.', 'Pan-sear salmon fillets for 4 minutes per side.', 'Pour glaze over salmon and reduce until sticky.', 'Steam bok choy and serve alongside salmon.']
      },
      {
        variation: 'Mediterranean', flag: 'gr',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
        time: '30 min', difficulty: 'Medium',
        aiModifications: '10-Year Log Adjustments: Substituted heavy butter with extra virgin olive oil. Added Kalamata olives and feta cheese.',
        ingredients: ['2 Salmon Fillets', 'Extra Virgin Olive Oil', 'Lemon Juice', 'Oregano', 'Kalamata Olives', 'Feta Cheese (David Only)'],
        instructions: ['Marinate salmon in olive oil, lemon, and oregano.', 'Bake at 400°F for 15 minutes.', 'Top with olives and feta cheese for David.']
      },
      {
        variation: 'Mexican', flag: 'mx',
        image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&q=80&w=600',
        time: '25 min', difficulty: 'Easy',
        aiModifications: '10-Year Log Adjustments: Swapped standard herbs for a smoky adobo chipotle rub.',
        ingredients: ['2 Salmon Fillets', 'Chipotle in Adobo', 'Avocado', 'Red Onion', 'Lime', 'Cilantro'],
        instructions: ['Rub salmon with chipotle paste.', 'Bake at 400°F.', 'Top with avocado salsa.']
      }
    ]
  },
  {
    id: 2,
    title: 'Smoked Brisket & Slaw Tacos',
    variation: 'Texas BBQ', flag: 'us',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600',
    time: '4 hrs (Smoker)',
    minutes: 240,
    difficulty: 'Hard',
    categories: ['High Protein'],
    matchScore: 92,
    matchedFor: ['David', 'Aden'],
    warnings: ['Contains Red Meat', 'Not Keto'],
    aiModifications: '10-Year Log Adjustments: Aden is in an extreme caloric surplus for football, so the recipe dynamically scaled the brisket volume by 1.5x.',
    ingredients: ['4 lb Beef Brisket', 'Corn Taco Shells', 'Cabbage Slaw', 'Sugar-Free BBQ Rub'],
    instructions: ['Preheat smoker to 225°F. Smoke brisket for 4 hours.', 'Rest for 1 hour, then slice.', 'Assemble tacos.'],
    availableVariations: [
      {
        variation: 'Texas BBQ', flag: 'us',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600',
        time: '4 hrs', difficulty: 'Hard',
        aiModifications: 'Standard Texas BBQ variant.',
        ingredients: ['4 lb Beef Brisket', 'Corn Taco Shells', 'Cabbage Slaw', 'Sugar-Free BBQ Rub'],
        instructions: ['Preheat smoker to 225°F. Smoke brisket for 4 hours.', 'Rest for 1 hour, then slice.', 'Assemble tacos.']
      },
      {
        variation: 'Korean', flag: 'kr',
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600',
        time: '4 hrs', difficulty: 'Hard',
        aiModifications: 'Infused with gochujang and served with kimchi slaw.',
        ingredients: ['4 lb Beef Brisket', 'Gochujang', 'Kimchi Slaw', 'Sesame Seeds'],
        instructions: ['Smoke brisket with gochujang rub.', 'Serve with kimchi slaw.']
      }
    ]
  },
  {
    id: 3,
    title: 'Hidden-Veggie Mac & Cheese',
    variation: 'American', flag: 'us',
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&q=80&w=600',
    time: '30 min',
    minutes: 30,
    difficulty: 'Medium',
    categories: ['Kid-Friendly'],
    matchScore: 100,
    matchedFor: ['Aden', 'Sophia', 'Oliver'],
    warnings: ['Contains Dairy', 'Contains Gluten'],
    aiModifications: '10-Year Log Adjustments: Pureed squash and cauliflower into cheddar sauce.',
    ingredients: ['1 lb Elbow Macaroni', '2 cups Mild Cheddar', '1 cup Butternut Squash', '1 cup Cauliflower'],
    instructions: ['Boil macaroni.', 'Blend steamed veggies with milk.', 'Combine sauce with pasta.'],
    availableVariations: [
      {
        variation: 'American', flag: 'us',
        image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&q=80&w=600',
        time: '30 min', difficulty: 'Medium',
        aiModifications: '10-Year Log Adjustments: Pureed squash and cauliflower into cheddar sauce.',
        ingredients: ['1 lb Elbow Macaroni', '2 cups Mild Cheddar', '1 cup Butternut Squash', '1 cup Cauliflower'],
        instructions: ['Boil macaroni.', 'Blend steamed veggies with milk.', 'Combine sauce with pasta.']
      },
      {
        variation: 'Italian', flag: 'it',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
        time: '30 min', difficulty: 'Medium',
        aiModifications: 'Swapped cheddar for parmesan and mozzarella. Added basil.',
        ingredients: ['1 lb Penne', 'Parmesan', 'Mozzarella', 'Fresh Basil'],
        instructions: ['Boil penne.', 'Make cheese sauce with parmesan.', 'Toss with fresh basil.']
      }
    ]
  },
  {
    id: 4,
    title: 'Spicy Noodles',
    variation: 'Korean', flag: 'kr',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600',
    time: '20 min',
    minutes: 20,
    difficulty: 'Medium',
    categories: ['Spicy'],
    matchScore: 92,
    matchedFor: ['Maya'],
    warnings: ['Contains Soy'],
    aiModifications: '10-Year Log Adjustments: Used Gochujang and sesame oil.',
    ingredients: ['1 lb Ramen Noodles', 'Gochujang Paste', 'Sesame Oil', 'Scallions'],
    instructions: ['Boil ramen noodles.', 'Mix Gochujang, sesame oil.', 'Toss noodles.'],
    availableVariations: [
      {
        variation: 'Korean', flag: 'kr',
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600',
        time: '20 min', difficulty: 'Medium',
        aiModifications: '10-Year Log Adjustments: Used Gochujang and sesame oil.',
        ingredients: ['1 lb Ramen Noodles', 'Gochujang Paste', 'Sesame Oil', 'Scallions'],
        instructions: ['Boil ramen noodles.', 'Mix Gochujang, sesame oil.', 'Toss noodles.']
      },
      {
        variation: 'Indian', flag: 'in',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=600',
        time: '25 min', difficulty: 'Medium',
        aiModifications: 'Infused with turmeric and garam masala.',
        ingredients: ['1 lb Chickpea Noodles', '2 tbsp Garam Masala', '1 tsp Turmeric', 'Coconut Milk'],
        instructions: ['Boil chickpea noodles.', 'Add spices and coconut milk.', 'Toss noodles.']
      },
      {
        variation: 'Mexican', flag: 'mx',
        image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=600',
        time: '20 min', difficulty: 'Easy',
        aiModifications: 'Fused traditional fajita seasonings with a noodle base.',
        ingredients: ['1 lb Pasta', 'Fajita Seasoning', 'Grilled Chicken Strips', 'Bell Peppers'],
        instructions: ['Cook pasta.', 'Grill chicken strips with fajita seasoning.', 'Combine.']
      }
    ]
  }
];

  // Reusable Tag Input for Recipe Editing
const TagInput = ({ tags, setTags, placeholder, colorTheme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={`w-full bg-black/20 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 transition-colors focus-within:border-white/30`}>
      <AnimatePresence>
        {tags.map((tag, index) => (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={index} 
            className={`flex items-center gap-1.5 text-[10px] bg-white/10 text-white border border-white/20 px-2 py-1 rounded-md font-bold shadow-sm`}
          >
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="hover:text-red-400 transition-colors p-0.5 rounded-full hover:bg-black/20">
              <FiX size={10} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : "Add more (press Enter)..."}
        className="flex-1 min-w-[130px] bg-transparent text-[11px] text-white focus:outline-none placeholder:text-gray-500 py-1"
      />
    </div>
  );
};

const Cookbook = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  
  // Force update when initialRecipes changes (useful for HMR during dev)
  useEffect(() => {
    setRecipes(initialRecipes);
  }, []);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [variationModalRecipe, setVariationModalRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Recipes');
  
  // CRUD States
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const openMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuRef.current && !openMenuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtering Logic
  const filters = ['All Recipes', 'For Maya', 'For David', 'Kid-Friendly', 'Under 30 Min', 'High Protein', 'Keto Approved'];
  
  const filteredRecipes = recipes.filter(r => {
    // Search
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filters
    if (activeFilter === 'For Maya' && !r.matchedFor.includes('Maya')) return false;
    if (activeFilter === 'For David' && !r.matchedFor.includes('David')) return false;
    if (activeFilter === 'Kid-Friendly' && !r.categories.includes('Kid-Friendly')) return false;
    if (activeFilter === 'Under 30 Min' && r.minutes > 30) return false;
    if (activeFilter === 'High Protein' && !r.categories.includes('High Protein')) return false;
    if (activeFilter === 'Keto Approved' && !r.categories.includes('Keto Approved')) return false;
    
    return true;
  });

  const openDrawer = (recipe = null) => {
    if (recipe) {
      if (recipe.availableVariations && recipe.availableVariations.length > 0) {
        setVariationModalRecipe(recipe);
        return;
      }
      setActiveVariationIndex(0);
      setSelectedRecipe(recipe);
      setEditForm({ ...recipe });
      setIsAdding(false);
      setIsEditing(false);
    } else {
      const newRecipe = {
        id: Date.now(),
        title: '',
        image: 'https://images.unsplash.com/photo-1490818387583-1b5ba45227fa?auto=format&fit=crop&q=80&w=600',
        time: '',
        minutes: 30,
        difficulty: 'Medium',
        categories: [],
        matchScore: 100,
        matchedFor: [],
        warnings: [],
        aiModifications: '',
        ingredients: [],
        instructions: []
      };
      setSelectedRecipe(newRecipe);
      setEditForm(newRecipe);
      setIsAdding(true);
      setIsEditing(true);
    }
    setMenuOpenId(null);
  };

  
  const handleSelectVariation = (recipe, index) => {
    setActiveVariationIndex(index);
    setSelectedRecipe(recipe);
    setEditForm({ ...recipe });
    setIsAdding(false);
    setIsEditing(false);
    setVariationModalRecipe(null);
  };

  const closeDrawer = () => {
    setSelectedRecipe(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editForm.title) {
      toast.error("Recipe title is required.");
      return;
    }

    const loadToast = toast.loading(isAdding ? "Generating AI Context..." : "Synchronizing Recipe Data...", {
      style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });

    setTimeout(() => {
      if (isAdding) {
        setRecipes([editForm, ...recipes]);
      } else {
        setRecipes(recipes.map(r => r.id === editForm.id ? editForm : r));
      }
      
      setSelectedRecipe(editForm);
      setIsEditing(false);
      setIsAdding(false);
      
      toast.success(isAdding ? "Recipe Uploaded!" : "Recipe Synced!", {
        id: loadToast,
        style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }, 1200);
  };

  const handleDelete = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
    toast.success("Recipe removed from Cookbook.", {
      style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    setMenuOpenId(null);
    closeDrawer();
  };

  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(0);

  // Parse timer from text when step changes
  useEffect(() => {
    if (isCookingMode && selectedRecipe && selectedRecipe.instructions[currentStepIndex]) {
      const match = selectedRecipe.instructions[currentStepIndex].match(/(\d+)\s*(minutes|min|hours|hrs)/i);
      if (match) {
        let mins = parseInt(match[1], 10);
        if (match[2].toLowerCase().startsWith('h')) mins *= 60;
        const totalSeconds = mins * 60;
        setTimerSeconds(totalSeconds);
        setTimerInitial(totalSeconds);
        setIsTimerRunning(false);
      } else {
        setTimerSeconds(0);
        setTimerInitial(0);
        setIsTimerRunning(false);
      }
    }
  }, [currentStepIndex, isCookingMode, selectedRecipe]);

  // Run countdown
  useEffect(() => {
    let interval;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast.success("Timer Finished!");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleTimer = () => {
    if (timerSeconds > 0) {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startCooking = () => {
    setIsCookingMode(true);
    setCurrentStepIndex(0);
    
    // Log to local storage for Home screen notifications
    const logs = JSON.parse(localStorage.getItem('honestiLogs') || '[]');
    logs.unshift({
      id: Date.now(),
      type: 'info',
      title: 'Cooking Session Started',
      message: `Started cooking: ${selectedRecipe.title}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('honestiLogs', JSON.stringify(logs));
    toast.success("Cooking session logged to Dashboard.");
  };

  const closeCooking = () => {
    setIsCookingMode(false);
    setIsTimerRunning(false);
    
    // Log completion to local storage
    const logs = JSON.parse(localStorage.getItem('honestiLogs') || '[]');
    logs.unshift({
      id: Date.now(),
      type: 'success',
      title: 'Dinner is Ready!',
      message: `Finished cooking: ${selectedRecipe.title}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('honestiLogs', JSON.stringify(logs));
    toast.success("Meal logged. Dinner is ready!");
  };

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [personaFeedbacks, setPersonaFeedbacks] = useState({});
  const [activeNotePersona, setActiveNotePersona] = useState(null); // Which persona is currently typing a note

  const submitFeedbackAndClose = () => {
    const logs = JSON.parse(localStorage.getItem('honestiLogs') || '[]');
    const mealId = Date.now();
    logs.unshift({
      id: mealId,
      type: 'success',
      title: 'Dinner is Ready! (Feedback Saved)',
      message: `Finished: ${selectedRecipe.title}. Feedback processed for the household.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('honestiLogs', JSON.stringify(logs));

    // Save to detailed feedback database
    const feedbackList = JSON.parse(localStorage.getItem('honestiFeedback') || '[]');
    const mealPersonas = selectedRecipe.matchedFor.map(name => {
       const fb = personaFeedbacks[name];
       if (fb) {
         return { name, status: 'Submitted', rating: fb.emoji, note: fb.note || '' };
       }
       return { name, status: 'Pending', rating: null, note: '' };
    });

    // Also include anyone who wasn't in matchedFor but left feedback (just in case)
    Object.keys(personaFeedbacks).forEach(name => {
      if (!selectedRecipe.matchedFor.includes(name)) {
        mealPersonas.push({ name, status: 'Submitted', rating: personaFeedbacks[name].emoji, note: personaFeedbacks[name].note || '' });
      }
    });

    feedbackList.unshift({
      id: mealId,
      recipeName: selectedRecipe.title,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: mealPersonas.every(p => p.status === 'Submitted') ? '100% Complete' : 'Follow-up Active',
      personas: mealPersonas
    });
    localStorage.setItem('honestiFeedback', JSON.stringify(feedbackList));

    toast.success("Feedback logged to Household Analytics!");
    
    setShowFeedbackModal(false);
    setIsCookingMode(false);
    setIsTimerRunning(false);
    setPersonaFeedbacks({});
    setActiveNotePersona(null);
  };

  const nextStep = () => {
    if (currentStepIndex < selectedRecipe.instructions.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowFeedbackModal(true); // Pop up feedback instead of closing immediately
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="h-full w-full text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Global Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/70 backdrop-blur-md pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-5 md:p-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-5 gap-3 md:gap-5">
          <div className="flex-1">
            <h1 className="text-[22px] md:text-[28px] font-bold tracking-tight mb-0 md:mb-1.5 drop-shadow-md">Global Cookbook</h1>
            <p className="hidden md:block text-gray-300 text-[12px] font-medium drop-shadow-sm">Context-aware recipes dynamically modified for your household's 10-year persona history.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3 shrink-0">
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search recipes, ingredients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f1523]/80 backdrop-blur-md border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-[12px] text-white focus:border-[#0077ff] focus:outline-none transition-colors shadow-inner"
              />
            </div>
            <button 
              onClick={() => openDrawer()}
              className="cursor-pointer bg-[#0077ff] hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-[13px] md:text-[12px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all flex items-center gap-1 md:gap-1.5 active:scale-95 border border-blue-400/30 shrink-0"
            >
              <FiPlus size={16} /><span className="hidden sm:inline">Add</span><span className="hidden md:inline">&nbsp;Recipe</span>
            </button>
          </div>
        </div>

        {/* Filters/Pills */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6">
          {filters.map((filter, i) => (
            <button 
              key={i} 
              onClick={() => setActiveFilter(filter)}
              className={`cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full text-[14px] md:text-[11px] font-bold transition-all border ${activeFilter === filter ? 'bg-[#0077ff] border-[#0077ff] text-white shadow-[0_0_15px_rgba(0,119,255,0.3)]' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <motion.div 
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6, borderColor: 'rgba(0, 119, 255, 0.4)' }}
                onClick={() => openDrawer(recipe)}
                className="cursor-pointer bg-[#0f1523]/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-visible shadow-2xl group flex flex-col transition-all duration-300 relative"
              >
                {/* 3 Dots Menu */}
                <div className="absolute top-3 right-3 z-30">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === recipe.id ? null : recipe.id); }}
                    className="cursor-pointer p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
                  >
                    <FiMoreHorizontal size={14} />
                  </button>
                  <AnimatePresence>
                    {menuOpenId === recipe.id && (
                      <motion.div 
                        ref={openMenuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-36 bg-[#0f1523] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); openDrawer(recipe); setIsEditing(true); }}
                          className="cursor-pointer w-full text-left px-4 py-2.5 text-[14px] md:text-[11px] font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <FiEdit2 size={12}/> Edit Recipe
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}
                          className="cursor-pointer w-full text-left px-4 py-2.5 text-[14px] md:text-[11px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                          <FiTrash2 size={12}/> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Match Badge */}
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-[#042f1d]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg shadow-lg">
                    <FiCheckCircle size={12} />
                    <span className="text-[12px] md:text-[10px] font-bold uppercase tracking-wider">{recipe.matchScore}% Household Match</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-[18px] md:text-[16px] font-bold tracking-tight group-hover:text-[#0077ff] transition-colors leading-tight">{recipe.title}</h3>
                    {recipe.variation && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#0077ff]/20 border border-[#0077ff]/40 text-[#b3d4ff] shadow-sm shrink-0 whitespace-nowrap">
                        {recipe.flag && <img src={`https://flagcdn.com/w20/${recipe.flag}.png`} alt="flag" className="w-3.5 h-auto rounded-[2px] shadow-sm" />}
                        {recipe.variation}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mb-4 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><FiClock size={12}/> {recipe.time}</span>
                    <span className="flex items-center gap-1.5"><FiUsers size={12}/> {recipe.difficulty}</span>
                  </div>

                  {/* AI Context Tags */}
                  <div className="space-y-2 mb-4 flex-1">
                    {recipe.matchedFor.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[11px] md:text-[9px] bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold shadow-sm">
                          Perfect for: {recipe.matchedFor.join(', ')}
                        </span>
                      </div>
                    )}
                    {recipe.warnings.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2">
                        {recipe.warnings.map((w, i) => (
                          <span key={i} className="text-[11px] md:text-[9px] bg-[#3f0f14] text-red-300 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold shadow-sm">
                            <FiAlertTriangle size={10} /> {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[#0077ff]">
                    <span className="text-[14px] md:text-[11px] font-bold uppercase tracking-widest">View AI Modifications</span>
                    <FiChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Right Drawer Overlay for Recipe Details */}
      <AnimatePresence>
        {selectedRecipe && !isCookingMode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[400px] md:w-[480px] max-w-full bg-[#0b0f19]/95 backdrop-blur-3xl border-l border-white/10 z-50 shadow-2xl flex flex-col"
            >
              
              {/* Recipe Drawer Header (Image background) - REDUCED HEIGHT */}
              <div className="relative h-48 w-full shrink-0 group flex flex-col">
                {isEditing ? (
                  <>
                    <img src={editForm.image} alt="Upload" className="w-full h-full object-cover brightness-50" />
                    <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center text-white/50 cursor-pointer hover:text-white transition-colors">
                      <FiImage size={32} className="mb-2" />
                      <span className="text-[12px] font-bold tracking-widest uppercase">Change Image URL</span>
                    </div>
                  </>
                ) : (
                  <img src={selectedRecipe.availableVariations?.[activeVariationIndex]?.image || selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent pointer-events-none"></div>
                
                <div className="absolute top-5 right-5 flex gap-2 z-20">
                  {!isAdding && !isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={closeDrawer} 
                    className="cursor-pointer p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-5 right-5 z-20">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 mb-2">
                      <input 
                        type="text" 
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        placeholder="Recipe Title"
                        className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-md px-3 py-1.5 text-lg font-bold text-white focus:border-[#0077ff] focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editForm.variation || ''}
                          onChange={(e) => setEditForm({...editForm, variation: e.target.value})}
                          placeholder="Variation Tag (e.g. Italian)"
                          className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-md px-3 py-1.5 text-[12px] font-bold text-white focus:border-[#0077ff] focus:outline-none"
                        />
                        <input 
                          type="text" 
                          value={editForm.flag || ''}
                          onChange={(e) => setEditForm({...editForm, flag: e.target.value})}
                          placeholder="Flag Code (e.g. it, mx)"
                          className="w-24 md:w-32 bg-black/40 backdrop-blur-md border border-white/20 rounded-md px-2 md:px-3 py-1.5 text-[12px] font-bold text-white focus:border-[#0077ff] focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mb-2">
                      <h2 className="text-xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">{selectedRecipe.title}</h2>
                      {selectedRecipe.variation && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#00E5FF] drop-shadow-lg">
                          {selectedRecipe.flag && <img src={`https://flagcdn.com/w20/${selectedRecipe.flag}.png`} alt="flag" className="w-4 h-auto rounded-[2px] shadow-sm" />}
                          {selectedRecipe.variation}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 text-[10px] text-gray-300 font-bold uppercase tracking-wider drop-shadow-md">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editForm.time}
                        onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                        placeholder="Time (e.g. 20 min)"
                        className="bg-black/40 border border-white/20 rounded-md px-2 py-1 text-white focus:outline-none w-24"
                      />
                    ) : (
                      <span className="flex items-center gap-1.5"><FiClock size={12} className="text-[#0077ff]"/> {selectedRecipe.time}</span>
                    )}
                    
                    {isEditing ? (
                      <select 
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                        className="bg-black/40 border border-white/20 rounded-md px-2 py-1 text-white focus:outline-none w-24"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    ) : (
                      <span className="flex items-center gap-1.5"><FiUsers size={12} className="text-emerald-400"/> {selectedRecipe.difficulty}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Recipe Content */}
              <div className="p-6 space-y-8 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                
                {/* Personalized Badges IN THE DRAWER */}
                {!isEditing && (selectedRecipe.matchedFor.length > 0 || selectedRecipe.warnings.length > 0) && (
                  <section className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-[14px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Household Impact</h4>
                    {selectedRecipe.matchedFor.length > 0 && (
                      <span className="text-[11px] text-blue-300 font-bold flex items-center gap-2">
                        <FiCheckCircle size={14} className="text-blue-500"/> Perfect for: {selectedRecipe.matchedFor.join(', ')}
                      </span>
                    )}
                    {selectedRecipe.warnings.length > 0 && selectedRecipe.warnings.map((w, i) => (
                      <span key={i} className="text-[11px] text-red-300 font-bold flex items-center gap-2">
                        <FiAlertTriangle size={14} className="text-red-500"/> {w}
                      </span>
                    ))}
                  </section>
                )}

                {/* AI Modifications (The Magic) */}
                <section className={`rounded-xl shadow-inner relative overflow-hidden ${isEditing ? "p-0 md:p-4" : "p-4"} ${isEditing ? '' : 'bg-gradient-to-br from-[#0077ff]/10 to-purple-500/10 border border-[#0077ff]/30'}`}>
                  {!isEditing && (
                    <div className="absolute -right-4 -top-4 text-[#0077ff]/10">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    </div>
                  )}
                  <h4 className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-3 flex items-center gap-2">
                    ✨ Honesti AI Adjustments (10-Yr Log)
                  </h4>
                  {isEditing ? (
                    <textarea 
                      value={editForm.aiModifications}
                      onChange={(e) => setEditForm({...editForm, aiModifications: e.target.value})}
                      placeholder="Detail the AI modifications made to this recipe..."
                      className="w-full bg-black/20 border border-[#0077ff]/40 rounded-lg p-3 text-[12px] text-gray-200 focus:outline-none min-h-[100px] custom-scrollbar"
                    />
                  ) : (
                    <p className="text-[12.5px] text-gray-200 leading-relaxed font-medium relative z-10">
                      {selectedRecipe.availableVariations?.[activeVariationIndex]?.aiModifications || selectedRecipe.aiModifications || "No automated modifications applied."}
                    </p>
                  )}
                </section>

                {/* Editable Tags (Matched For & Warnings) */}
                {isEditing && (
                  <section className="space-y-4">
                    <div>
                      <h4 className="text-[14px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Perfect For (Household Members)</h4>
                      <TagInput 
                        tags={editForm.matchedFor}
                        setTags={(newTags) => setEditForm({ ...editForm, matchedFor: newTags })}
                        placeholder="e.g. Maya..."
                        colorTheme="blue"
                      />
                    </div>
                    <div>
                      <h4 className="text-[14px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Warnings</h4>
                      <TagInput 
                        tags={editForm.warnings}
                        setTags={(newTags) => setEditForm({ ...editForm, warnings: newTags })}
                        placeholder="e.g. Contains Nuts..."
                        colorTheme="red"
                      />
                    </div>
                  </section>
                )}

                {/* Ingredients */}
                <section>
                  <h4 className="text-[14px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex justify-between">
                    Smart Grocery List
                  </h4>
                  {isEditing ? (
                    <TagInput 
                      tags={editForm.ingredients}
                      setTags={(newTags) => setEditForm({ ...editForm, ingredients: newTags })}
                      placeholder="Add ingredient..."
                      colorTheme="green"
                    />
                  ) : (
                    <ul className="space-y-3">
                      {(selectedRecipe.availableVariations?.[activeVariationIndex]?.ingredients || selectedRecipe.ingredients).map((ing, i) => (
                        <li key={i} className="flex items-center justify-between text-[14px] md:text-[13px] text-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {ing}
                          </div>
                          <span className="text-[9px] text-gray-500 uppercase font-bold px-2 py-1 bg-white/5 rounded">In Pantry</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Instructions */}
                <section>
                  <h4 className="text-[14px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                    Step-by-Step
                  </h4>
                  {isEditing ? (
                    <div className="space-y-3">
                      {editForm.instructions.map((step, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <textarea 
                            value={step}
                            onChange={(e) => {
                              const newInst = [...editForm.instructions];
                              newInst[i] = e.target.value;
                              setEditForm({...editForm, instructions: newInst});
                            }}
                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-[12px] text-gray-300 focus:outline-none min-h-[50px] resize-none"
                          />
                          <button onClick={() => setEditForm({...editForm, instructions: editForm.instructions.filter((_, idx) => idx !== i)})} className="p-2 text-red-400 hover:bg-white/5 rounded-lg">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setEditForm({...editForm, instructions: [...editForm.instructions, '']})}
                        className="text-[14px] md:text-[11px] font-bold text-[#0077ff] flex items-center gap-1 hover:underline"
                      >
                        <FiPlus /> Add Step
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {(selectedRecipe.availableVariations?.[activeVariationIndex]?.instructions || selectedRecipe.instructions).map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 shrink-0 rounded-full bg-[#0077ff]/20 text-[#0077ff] flex items-center justify-center text-[10px] font-black border border-[#0077ff]/30">
                            {i + 1}
                          </div>
                          <p className="text-[14px] md:text-[13px] text-gray-300 leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                
              </div>
              
              {/* Drawer Footer */}
              <div className="p-5 border-t border-white/10 bg-black/20 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    className="cursor-pointer w-full py-3.5 bg-[#0077ff] hover:bg-blue-600 text-[13px] font-bold text-white rounded-xl shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FiSave size={16} /> Save Recipe Data
                  </button>
                ) : (
                  <button 
                    onClick={startCooking}
                    className="cursor-pointer w-full py-3.5 bg-[#00E5FF] hover:bg-[#00c2d6] text-[13px] font-bold text-black rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FiPlay size={16} /> Start Smart Cooking Mode
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Smart Cooking Mode Full-Screen Overlay */}
      <AnimatePresence>
        {isCookingMode && selectedRecipe && !showFeedbackModal && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
          >
            {/* Background Image Blurred */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/Honesti 3D Avatar.jfif" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-40 blur-[3px] scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-[#0b0f19]/70 backdrop-blur-xl pointer-events-none"></div>
            </div>

            {/* Header - Slimmed down padding and radius */}
            <div className="relative z-10 py-3 px-4 md:px-6 flex justify-between items-center border-b border-white/10 bg-[#0b0f19]/60 backdrop-blur-2xl shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={closeCooking}
                  className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors border border-white/10"
                >
                  <FiX size={18} />
                </button>
                <div>
                  <h2 className="text-base md:text-lg font-bold tracking-tight text-white">{selectedRecipe.title}</h2>
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    HONESTI LISTENING... (Say "Next Step")
                  </div>
                </div>
              </div>
              <button 
                onClick={closeCooking}
                className="cursor-pointer bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-1.5 rounded-lg font-bold tracking-widest text-[10px] md:text-xs transition-colors border border-red-500/30"
              >
                END COOKING
              </button>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-8 w-full overflow-y-auto custom-scrollbar">
              
              <div className="text-center w-full max-w-5xl mx-auto my-auto pb-4">
                <div className="text-[11px] md:text-xs font-bold text-[#0077ff] tracking-widest uppercase mb-4">
                  Step {currentStepIndex + 1} of {selectedRecipe.instructions.length}
                </div>
                
                <motion.h1 
                  key={currentStepIndex} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl md:text-4xl font-bold text-white leading-relaxed md:leading-relaxed drop-shadow-2xl mb-6 max-w-4xl mx-auto"
                >
                  {selectedRecipe.instructions[currentStepIndex]}
                </motion.h1>

                {/* Functional Timer Area - Slimmer */}
                {timerInitial > 0 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={toggleTimer}
                    className={`mt-4 md:mt-6 mx-auto inline-flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full border-4 ${isTimerRunning ? 'border-[#00E5FF] shadow-[0_0_50px_rgba(0,229,255,0.4)]' : 'border-[#00E5FF]/30 shadow-[0_0_50px_rgba(0,229,255,0.15)]'} bg-[#0f1523]/60 backdrop-blur-2xl cursor-pointer hover:border-[#00E5FF] hover:shadow-[0_0_50px_rgba(0,229,255,0.3)] transition-all shrink-0`}
                  >
                    <span className="text-3xl md:text-4xl font-black text-[#00E5FF]">
                      {formatTime(timerSeconds)}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {isTimerRunning ? 'Tap to Pause' : timerSeconds > 0 && timerSeconds < timerInitial ? 'Tap to Resume' : 'Tap to Start'}
                    </span>
                  </motion.div>
                )}
              </div>

            </div>

            {/* Footer Navigation - Slimmed padding and radius */}
            <div className="relative z-10 py-3 px-4 md:px-6 bg-[#0b0f19]/60 backdrop-blur-2xl border-t border-white/10 flex justify-between items-center gap-4 shrink-0">
              <button 
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="cursor-pointer px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 font-bold rounded-lg transition-colors text-xs md:text-sm border border-white/10"
              >
                Previous Step
              </button>
              
              {/* Responsive Progress Dots */}
              <div className="hidden sm:flex gap-1.5 flex-1 justify-center max-w-sm mx-auto overflow-hidden">
                {selectedRecipe.instructions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx === currentStepIndex ? 'bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]' : idx < currentStepIndex ? 'bg-[#0077ff]' : 'bg-white/10'}`}
                  ></div>
                ))}
              </div>

              <button 
                onClick={nextStep}
                className="cursor-pointer px-6 py-2 bg-[#0077ff] hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-colors text-sm md:text-base border border-blue-400/30 whitespace-nowrap"
              >
                {currentStepIndex === selectedRecipe.instructions.length - 1 ? 'Finish Cooking' : 'Next Step'}
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Variation Selection Modal */}
      <AnimatePresence>
        {variationModalRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0f19] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col items-center relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] to-[#0077ff]"></div>
              
              <button 
                onClick={() => setVariationModalRecipe(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>

              <h2 className="text-xl font-bold text-white mb-2 tracking-tight mt-2 text-center">Select Cultural Variation</h2>
              <p className="text-gray-400 text-[11px] text-center mb-6">Choose a tradition for {variationModalRecipe.title}</p>

              <div className="flex flex-col gap-3 w-full mb-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {variationModalRecipe.availableVariations.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectVariation(variationModalRecipe, idx)}
                    className="flex items-center gap-3 w-full bg-white/5 hover:bg-[#0077ff]/20 border border-white/10 hover:border-[#0077ff]/50 rounded-xl p-4 transition-all group cursor-pointer text-left"
                  >
                    {v.flag && <img src={`https://flagcdn.com/w40/${v.flag}.png`} alt="flag" className="w-8 h-auto rounded shadow-md group-hover:scale-110 transition-transform" />}
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[14px]">{v.variation} Style</span>
                      <span className="text-gray-400 text-[10px] uppercase tracking-wider">{v.time} • {v.difficulty}</span>
                    </div>
                    <FiChevronRight size={18} className="text-[#0077ff] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-Meal Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0f19] border border-white/10 rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl flex flex-col items-center relative overflow-y-auto custom-scrollbar max-h-[90vh]"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] to-[#0077ff]"></div>

              <button 
                onClick={() => { setShowFeedbackModal(false); closeCooking(); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>

              <h2 className="text-xl font-bold text-white mb-1 tracking-tight mt-2">Dinner is Served! 🎉</h2>
              <p className="text-gray-400 text-[11px] text-center mb-6">How did everyone like the {selectedRecipe?.title}?</p>

              {/* Avatar Grid */}
              <div className="w-full mb-5">
                <label className="block text-[14px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Household Feedback</label>
                <div className="flex flex-wrap justify-center gap-4 mb-2">
                  {selectedRecipe?.matchedFor.map((persona) => (
                    <div key={persona} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077ff] to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-[#0b0f19]">
                        {persona.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-[10px] text-gray-300 font-bold">{persona}</p>
                      <div className="flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
                        {['😍', '😐', '🤢'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setPersonaFeedbacks(prev => ({ ...prev, [persona]: { ...prev[persona], emoji } }));
                              if (emoji === '😐' || emoji === '🤢') setActiveNotePersona(persona);
                              else if (activeNotePersona === persona) setActiveNotePersona(null);
                            }}
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-sm transition-all cursor-pointer ${personaFeedbacks[persona]?.emoji === emoji ? 'bg-[#0077ff] shadow-md scale-110' : 'hover:bg-white/10'}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Note Dropdown */}
                <AnimatePresence>
                  {activeNotePersona && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                        <label className="block text-[10px] font-bold text-[#0077ff] uppercase tracking-widest mb-2 flex justify-between">
                          <span>Why didn't {activeNotePersona} love it?</span>
                          <button onClick={() => setActiveNotePersona(null)} className="text-gray-400 hover:text-white"><FiX size={12}/></button>
                        </label>
                        <input
                          type="text"
                          value={personaFeedbacks[activeNotePersona]?.note || ''}
                          onChange={(e) => setPersonaFeedbacks(prev => ({ ...prev, [activeNotePersona]: { ...prev[activeNotePersona], note: e.target.value } }))}
                          placeholder={`e.g., Too spicy, needs less salt...`}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#0077ff]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Investor Note */}
              <div className="w-full bg-[#0077ff]/10 border border-[#0077ff]/30 rounded-xl p-3 mb-5 relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0077ff]"></div>
                <p className="text-[10px] text-blue-100 font-medium leading-relaxed">
                  <span className="font-bold text-[#00E5FF] uppercase tracking-widest text-[9px] block mb-1">MVP Architecture</span> 
                  Fallback feedback links are dynamically dispatched via email to family members. 
                  <br/><br/>
                  <span className="font-bold text-[#00E5FF] uppercase tracking-widest text-[9px] block mb-1">Future Roadmap</span> 
                  A dedicated Honesti Mobile App will receive live push notifications for real-time rating updates.
                </p>
              </div>

              <button
                onClick={submitFeedbackAndClose}
                className="w-full py-3 bg-[#00E5FF] hover:bg-[#00c2d6] text-[12px] font-bold text-black rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                Save Feedback
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Cookbook;







