const fs = require('fs');
let content = fs.readFileSync('src/pages/Cookbook.jsx', 'utf8');

const regex = /variation:\s*'([^']+)',\s*flag:\s*'([^']+)'/g;
content = content.replace(regex, (match, text, flag) => {
  let emoji = '';
  if (flag === 'us') emoji = '🇺🇸';
  else if (flag === 'kr') emoji = '🇰🇷';
  else if (flag === 'cu') emoji = '🇨🇺';
  else if (flag === 'in') emoji = '🇮🇳';
  else if (flag === 'mx') emoji = '🇲🇽';
  else if (flag === 'it') emoji = '🇮🇹';
  else if (flag === 'jp') emoji = '🇯🇵';
  else if (flag === 'gr') emoji = '🇬🇷';
  
  if (emoji) {
    return `variation: '${emoji} ${text}'`;
  }
  return match;
});

// Revert the render logic for the card
content = content.replace(
  /{recipe\.variation && \(\s*<span[^>]*>\s*{recipe\.flag && <img[^>]*>\s*}\s*{recipe\.variation}\s*<\/span>\s*\)}/s,
  `{recipe.variation && (
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#0077ff]/10 border border-[#0077ff]/20 text-[#0077ff] shadow-sm shrink-0 whitespace-nowrap">
                        {recipe.variation}
                      </span>
                    )}`
);

// Revert the render logic for the drawer
content = content.replace(
  /{selectedRecipe\.variation && \(\s*<span[^>]*>\s*{selectedRecipe\.flag && <img[^>]*>\s*}\s*{selectedRecipe\.variation}\s*<\/span>\s*\)}/s,
  `{selectedRecipe.variation && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#00E5FF] drop-shadow-lg">
                          {selectedRecipe.variation}
                        </span>
                      )}`
);

fs.writeFileSync('src/pages/Cookbook.jsx', content);
console.log('Reverted flags back to emojis!');
