const fs = require('fs');
let content = fs.readFileSync('src/pages/Cookbook.jsx', 'utf8');

const regex = /variation:\s*'([^']+)'/g;
content = content.replace(regex, (match, p1) => {
  let flag = '';
  let text = p1;
  if (p1.includes('🇺🇸')) { flag = 'us'; text = p1.replace('🇺🇸 ', ''); }
  else if (p1.includes('🇰🇷')) { flag = 'kr'; text = p1.replace('🇰🇷 ', ''); }
  else if (p1.includes('🇨🇺')) { flag = 'cu'; text = p1.replace('🇨🇺 ', ''); }
  else if (p1.includes('🇮🇳')) { flag = 'in'; text = p1.replace('🇮🇳 ', ''); }
  else if (p1.includes('🇲🇽')) { flag = 'mx'; text = p1.replace('🇲🇽 ', ''); }
  else if (p1.includes('🇮🇹')) { flag = 'it'; text = p1.replace('🇮🇹 ', ''); }
  else if (p1.includes('🇯🇵')) { flag = 'jp'; text = p1.replace('🇯🇵 ', ''); }
  else if (p1.includes('🇬🇷')) { flag = 'gr'; text = p1.replace('🇬🇷 ', ''); }
  
  if (flag) {
    return `variation: '${text}', flag: '${flag}'`;
  }
  return match;
});

// Update the render logic for the card
content = content.replace(
  /{recipe\.variation && \(\s*<span[^>]*>\s*{recipe\.variation}\s*<\/span>\s*\)}/s,
  `{recipe.variation && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#0077ff]/10 border border-[#0077ff]/20 text-[#0077ff] shadow-sm shrink-0 whitespace-nowrap">
                        {recipe.flag && <img src={\`https://flagcdn.com/w20/\${recipe.flag}.png\`} alt="flag" className="w-3.5 h-auto rounded-[2px] shadow-sm" />}
                        {recipe.variation}
                      </span>
                    )}`
);

// Update the render logic for the drawer (not editing)
content = content.replace(
  /{selectedRecipe\.variation && \(\s*<span[^>]*>\s*{selectedRecipe\.variation}\s*<\/span>\s*\)}/s,
  `{selectedRecipe.variation && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#00E5FF] drop-shadow-lg">
                          {selectedRecipe.flag && <img src={\`https://flagcdn.com/w20/\${selectedRecipe.flag}.png\`} alt="flag" className="w-4 h-auto rounded-[2px] shadow-sm" />}
                          {selectedRecipe.variation}
                        </span>
                      )}`
);

// Update the edit form
content = content.replace(
  /<input[^>]*value={editForm\.variation \|\| ''}[^>]*>/s,
  `<div className="flex gap-2">
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
                      </div>`
);

// Fix the issue where React hot-reload doesn't update the initial recipes
content = content.replace(
  /const \[recipes, setRecipes\] = useState\(initialRecipes\);/,
  `const [recipes, setRecipes] = useState(initialRecipes);
  
  // Force update when initialRecipes changes (useful for HMR during dev)
  useEffect(() => {
    setRecipes(initialRecipes);
  }, []);`
);

fs.writeFileSync('src/pages/Cookbook.jsx', content);
console.log('Done!');
