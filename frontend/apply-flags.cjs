const fs = require('fs');

let content = fs.readFileSync('src/pages/Cookbook.jsx', 'utf8');

// Function to replace variations with flag images
content = content.replace(/variation:\s*['"]([^'"]+)['"]/g, (match, val) => {
    let flagCode = '';
    let text = val;
    
    // Check for emoji or corrupted emoji string
    if (val.includes('American')) flagCode = 'us';
    else if (val.includes('Texas')) flagCode = 'us';
    else if (val.includes('Korean')) flagCode = 'kr';
    else if (val.includes('Cuban')) flagCode = 'cu';
    else if (val.includes('Indian')) flagCode = 'in';
    else if (val.includes('Mexican')) flagCode = 'mx';
    else if (val.includes('Italian')) flagCode = 'it';
    else if (val.includes('Japanese')) flagCode = 'jp';
    else if (val.includes('Mediterranean')) flagCode = 'gr';
    
    // Clean up any emojis or corrupted chars from text
    text = text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\s|,|dYاdY/g, ' ').trim();
    if (text.includes('American')) text = 'American';
    if (text.includes('Texas BBQ')) text = 'Texas BBQ';
    if (text.includes('Korean')) text = 'Korean';
    if (text.includes('Cuban')) text = 'Cuban';
    if (text.includes('Indian')) text = 'Indian';
    if (text.includes('Mexican')) text = 'Mexican';
    if (text.includes('Italian')) text = 'Italian';
    if (text.includes('Japanese')) text = 'Japanese';
    if (text.includes('Mediterranean')) text = 'Mediterranean';

    if (flagCode) {
        return `variation: '${text}', flag: '${flagCode}'`;
    }
    return match;
});

// 2. Update render on Card
const cardRenderRegex = /\{recipe\.variation && \(\s*<span className="text-\[9px\] font-bold tracking-wider uppercase px-2 py-1 rounded bg-\[#0077ff\]\/10 border border-\[#0077ff\]\/20 text-\[#0077ff\] shadow-sm shrink-0 whitespace-nowrap">\s*\{recipe\.variation\}\s*<\/span>\s*\)\}/s;
const newCardRender = `{recipe.variation && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#0077ff]/10 border border-[#0077ff]/20 text-[#0077ff] shadow-sm shrink-0 whitespace-nowrap">
                        {recipe.flag && <img src={\`https://flagcdn.com/w20/\${recipe.flag}.png\`} alt="flag" className="w-3.5 h-auto rounded-[2px] shadow-sm" />}
                        {recipe.variation}
                      </span>
                    )}`;
content = content.replace(cardRenderRegex, newCardRender);

// 3. Update render on Drawer Header
const drawerRenderRegex = /\{selectedRecipe\.variation && \(\s*<span className="text-\[10px\] font-bold tracking-wider uppercase text-\[#00E5FF\] drop-shadow-lg">\s*\{selectedRecipe\.variation\}\s*<\/span>\s*\)\}/s;
const newDrawerRender = `{selectedRecipe.variation && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#00E5FF] drop-shadow-lg">
                          {selectedRecipe.flag && <img src={\`https://flagcdn.com/w20/\${selectedRecipe.flag}.png\`} alt="flag" className="w-4 h-auto rounded-[2px] shadow-sm" />}
                          {selectedRecipe.variation}
                        </span>
                      )}`;
content = content.replace(drawerRenderRegex, newDrawerRender);

// 4. Update Edit form inputs
const editFormRegex = /<input\s+type="text"\s+value=\{editForm\.variation \|\| ''\}\s+onChange=\{\(e\) => setEditForm\(\{\.\.\.editForm, variation: e\.target\.value\}\)\}\s+placeholder="Variation Tag\/Flag \(e\.g\. 🇮🇹 Italian\)"\s+className="w-full bg-black\/40 backdrop-blur-md border border-white\/20 rounded-md px-3 py-1\.5 text-\[12px\] font-bold text-white focus:border-\[#0077ff\] focus:outline-none"\s+\/>/s;
const newEditForm = `<div className="flex gap-2">
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
                          className="w-32 bg-black/40 backdrop-blur-md border border-white/20 rounded-md px-3 py-1.5 text-[12px] font-bold text-white focus:border-[#0077ff] focus:outline-none"
                        />
                      </div>`;
content = content.replace(editFormRegex, newEditForm);

// Ensure useEffect hook is there to reload state
if (!content.includes('setRecipes(initialRecipes);')) {
  content = content.replace(
    /const \[recipes, setRecipes\] = useState\(initialRecipes\);/,
    `const [recipes, setRecipes] = useState(initialRecipes);
    
    // Force update when initialRecipes changes (useful for HMR during dev)
    useEffect(() => {
      setRecipes(initialRecipes);
    }, []);`
  );
}

fs.writeFileSync('src/pages/Cookbook.jsx', content);
console.log('Fixed file perfectly.');
