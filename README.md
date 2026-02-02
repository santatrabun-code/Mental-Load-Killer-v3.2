# Mental Load Keeper V3 🌱

**Energy-aware task companion with compassionate design**

A personal mental-load regulation system that tracks showing up, not performance. Adapts to your energy and biology while protecting your low-energy days.

---

## 🌟 Core Philosophy

### What This App Does

✅ Tracks **showing up**, not performance  
✅ Adapts to your **energy and biology**  
✅ Stores your **daily memory**  
✅ Reduces **guilt and pressure**  
✅ Externalizes **cognitive load**  
✅ Protects **low-energy days**  
✅ Normalizes **rest**

### What This App Does NOT Do

❌ No streaks  
❌ No punishment logic  
❌ No red failure states  
❌ No pressure notifications  
❌ No productivity shaming  
❌ No comparison logic  

---

## 🎯 Key Features

### 1. **Persistent Data Storage**
Everything saves automatically to your device:
- Daily tasks and completion
- Energy levels
- Rest days
- Brain vomit entries
- Reflections
- Day labels (gentle/normal/strong)
- Calendar heatmap data

### 2. **Energy-Aware Success Logic**
The app adjusts expectations based on YOUR energy:

- **High energy** → Higher expectations (3+ tasks)
- **Medium energy** → Moderate expectations (2+ tasks)
- **Low energy** → Minimal expectations (1+ task)
- **Rest day** → Automatic success, zero expectations

### 3. **Minimum Viable Day**
A day is successful if **ANY** of these happen:
- At least 1 task completed (any category)
- OR rest day marked

**There are no zero-day guilt mechanics.**

### 4. **New Category: 🏠 Chores**
Household tasks are now valid productivity! Chores:
- Count toward daily completion
- Count toward minimum viable day
- Count toward consistency metrics
- Are especially valuable on low-energy days

### 5. **Period/Cycle Tracking (Energy Context)**
Optional cycle awareness layer:
- Manually input period start dates
- Dynamic cycle length calculation (no fixed 28 days)
- Approximate phase tracking (menstrual, follicular, ovulatory, luteal)
- **Context only** - never imposes rules
- Your energy selection always overrides cycle logic

### 6. **Calendar Heatmap**
Visual history of your days:
- 🌙 Rest days (blue)
- 🌱 Gentle days (green)
- 🌿 Normal days (yellow)
- 🌳 Strong days (orange)
- Click any day to see full details

### 7. **Brain Vomit → Task Extraction**
Externalize your thoughts:
- Free-text brain dump
- Extract specific items as tasks
- Route to appropriate category
- Add optional deadlines
- Maintain shared IDs across systems

### 8. **Compassionate Metrics**
Replace productivity % with presence:
- Days you showed up
- Gentle days
- Normal days
- Strong days
- Rest days

**No performance scoring. No failure states.**

### 9. **End-of-Day Closure Ritual**
Optional reflection (doesn't affect metrics):
- "One thing I'm proud of"
- "One thing I release"
- Private and optional
- Helps with emotional closure

---

## 📋 Task Categories

### Studies 📚
- Lessons
- Homework
- Revision

### Languages 🌍
- 🇰🇷 Korean
- 🇬🇷 Greek
- 🇮🇱 Hebrew
- 🇩🇪 German

*Language tasks have content type dropdowns: Video, Song, Podcast, Reading*

### Other ✨
- 🏋️ Training
- 🏠 Chores *(NEW!)*

---

## 🎨 Design Language

- **Typography**: Serif font (Georgia) for warmth and readability
- **Colors**: Warm earth tones - no aggressive reds
- **Animations**: Gentle fades and transitions
- **Layout**: Spacious, breathable, calm
- **Tone**: Supportive, never pushy

---

## 🛠️ Technical Details

- **Frontend only**: Pure HTML/CSS/JavaScript
- **Storage**: localStorage (no cloud, no backend)
- **Offline-first**: Works completely offline after install
- **PWA-compatible**: Installable on mobile devices
- **Modular architecture**: Clean separation of concerns

---

## 📱 Installation

### For Mobile (PWA):

1. **Upload to GitHub Pages** (or any HTTPS host)
2. **Visit the URL** on your phone
3. **Add to Home Screen** (Chrome/Safari)
4. **App installs** with your custom icon

Full instructions in the package README.

### For Local Development:

Just open `index.html` in a modern browser. That's it!

---

## 🔒 Privacy & Data

- **100% local** - data never leaves your device
- **No tracking** - no analytics, no telemetry
- **No accounts** - no login required
- **Fully private** - only you can see your data

---

## 🌈 Use Cases

### Perfect for:
- Energy-sensitive individuals
- People with chronic fatigue
- Students managing coursework
- Language learners
- Anyone needing compassionate task management

### Works well with:
- ADHD
- Chronic illness
- Depression/anxiety
- Irregular schedules
- Unpredictable energy levels

---

## 📖 User Guide

### Daily Workflow

1. **Start your day**: Set your energy level (low/medium/high)
2. **Add tasks**: Click category → Add task
3. **Check off as you go**: Track completion without pressure
4. **Brain vomit**: Dump thoughts anytime
5. **Extract tasks**: Turn thoughts into actionable items
6. **End of day** (optional): Reflect and close

### Weekly Review

- Check **Calendar** page for visual patterns
- Visit **Insights** page for gentle metrics
- Notice what works for YOUR energy
- No judgment, just observation

### Cycle Tracking (Optional)

- Go to **Insights** page
- Add period start dates when they occur
- App calculates your unique cycle length
- See phase context on Today page
- Use as awareness, not rules

---

## 🎓 Philosophy Notes

### On "Productivity"

This app doesn't measure productivity. It measures **presence**.

Showing up on a low-energy day is as valuable as completing 10 tasks on a high-energy day. The system recognizes this.

### On Rest Days

Rest days are **mandatory success**. Marking a rest day means:
- Zero expectations
- Automatic success
- No task completion needed
- No guilt, ever

### On Cycle Awareness

Period tracking is context, not determinism:
- It suggests, never demands
- Your self-reported energy always wins
- Irregular cycles are normal and supported
- You can ignore it entirely

### On Metrics

We track:
- **Showing up** (days with any activity)
- **Day types** (rest/gentle/normal/strong)
- **Consistency** (not streaks)

We don't track:
- Performance percentages
- Failure rates
- Comparisons to others
- Comparisons to "ideal" you

---

## 🛡️ Emotional Safety Features

1. **No zero-day guilt**: Minimum viable day = 1 task OR rest
2. **No streak pressure**: Metrics show presence, not streaks
3. **No red states**: Only calming, supportive colors
4. **No notifications**: You control when to engage
5. **Rest normalization**: Rest days are celebrated, not penalized
6. **Energy flexibility**: Change energy anytime, no judgment

---

## 🚀 Future Possibilities (Not Implemented)

Ideas that maintain the philosophy:
- Export data for personal records
- Custom category creation
- Weekly reflection prompts
- Habit suggestions (gentle, optional)
- Time-of-day energy patterns

Ideas that would violate the philosophy:
- ❌ Social features / comparison
- ❌ Gamification / points
- ❌ Streak counters
- ❌ Performance goals
- ❌ Automated reminders

---

## 💝 For Developers

### Adding a New Task Category

1. Add to `TASK_CATEGORIES` in `script.js`
2. Add to category groups in `renderTasks()`
3. Add to extract modal options in `index.html`

### Modifying Energy Logic

Edit `ENERGY_EXPECTATIONS` object in `script.js`

### Changing Day Labels

Edit `calculateDayLabel()` function in `script.js`

### Customizing Colors

Modify CSS variables in `:root` at top of `index.html`

---

## 🙏 Credits

Built with compassion for people managing mental load, energy dysregulation, chronic conditions, and the beautiful chaos of being human.

**Design philosophy**: Psychological safety > Optimization

---

## 📄 License

This is a personal tool, not a commercial product.
Use it, modify it, share it with people who need it.

---

## 🌸 Final Note

You are doing enough.

Your worth is not measured in tasks completed.

Low-energy days are valid days.

Rest is productive.

This app exists to help you remember that.

---

**Mental Load Keeper V3** - *Showing up is enough* 🌱
