/* ========================================
   MENTAL LOAD KEEPER V3
   Compassionate, Energy-Aware Task Companion
   ======================================== */

/* ========================================
   CORE DATA STRUCTURE
   ======================================== */

// Storage keys
const STORAGE_KEY = 'mental_load_data_v3';
const PERIOD_KEY = 'period_tracking_v3';

// Global state
let appData = {
  days: {},  // Date-indexed daily records
  brainVomit: [],
  periodStarts: []
};

let currentCategory = null;
let currentBrainItemId = null;
let calendarViewDate = new Date();

/* ========================================
   DAILY DATA MODEL
   ======================================== */

function createDayRecord(dateStr) {
  return {
    date: dateStr,
    energy_level: 'medium',
    rest_day: false,
    tasks: {
      // Studies
      lessons: [],
      homework: [],
      revision: [],
      // Languages
      korean: [],
      greek: [],
      hebrew: [],
      german: [],
      // Other
      training: [],
      chores: []  // NEW CATEGORY
    },
    brain_vomit_entries: [],
    extracted_tasks: [],
    end_of_day_reflection: {
      proud_of: '',
      release: ''
    },
    daily_completion_percent: 0,
    day_label: 'gentle'  // gentle | normal | strong | rest
  };
}

function getDayRecord(dateStr) {
  if (!appData.days[dateStr]) {
    appData.days[dateStr] = createDayRecord(dateStr);
  }
  return appData.days[dateStr];
}

/* ========================================
   PERSISTENCE (localStorage)
   ======================================== */

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    localStorage.setItem(PERIOD_KEY, JSON.stringify(appData.periodStarts));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const periods = localStorage.getItem(PERIOD_KEY);
    
    if (saved) {
      appData = JSON.parse(saved);
    }
    
    if (periods) {
      appData.periodStarts = JSON.parse(periods);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
}

/* ========================================
   DATE UTILITIES
   ======================================== */

function getToday() {
  const now = new Date();
  return formatDate(now);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getReadableDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getMonthName(date) {
  const options = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/* ========================================
   CYCLE TRACKING (Energy Context Layer)
   ======================================== */

function calculateCyclePhase(dateStr) {
  if (appData.periodStarts.length === 0) {
    return null;
  }
  
  const date = new Date(dateStr + 'T00:00:00');
  const sortedStarts = appData.periodStarts
    .map(d => new Date(d + 'T00:00:00'))
    .sort((a, b) => a - b);
  
  // Find the most recent period start before or on this date
  let lastStart = null;
  for (const start of sortedStarts) {
    if (start <= date) {
      lastStart = start;
    }
  }
  
  if (!lastStart) {
    return null;
  }
  
  // Calculate average cycle length from historical data
  let avgCycleLength = 28;  // default
  if (sortedStarts.length >= 2) {
    const gaps = [];
    for (let i = 1; i < sortedStarts.length; i++) {
      const gap = Math.floor((sortedStarts[i] - sortedStarts[i-1]) / (1000*60*60*24));
      gaps.push(gap);
    }
    avgCycleLength = Math.round(gaps.reduce((a,b) => a+b, 0) / gaps.length);
  }
  
  // Calculate day in cycle
  const daysSinceStart = Math.floor((date - lastStart) / (1000*60*60*24));
  
  // Determine phase (approximate, not medical)
  let phase = '';
  if (daysSinceStart <= 5) {
    phase = 'menstrual';
  } else if (daysSinceStart <= 13) {
    phase = 'follicular';
  } else if (daysSinceStart <= 17) {
    phase = 'ovulatory';
  } else {
    phase = 'luteal';
  }
  
  return {
    phase: phase,
    dayInCycle: daysSinceStart + 1,
    avgCycleLength: avgCycleLength
  };
}

function addPeriodStart() {
  const input = document.getElementById('period-start-input');
  const date = input.value;
  
  if (!date) {
    alert('Please select a date');
    return;
  }
  
  if (!appData.periodStarts.includes(date)) {
    appData.periodStarts.push(date);
    appData.periodStarts.sort();
    saveData();
  }
  
  input.value = '';
  renderInsights();
}

function renderCycleInfo() {
  const today = getToday();
  const cycle = calculateCyclePhase(today);
  
  const infoDiv = document.getElementById('cycle-info');
  const historyList = document.getElementById('cycle-history');
  
  if (!cycle) {
    infoDiv.innerHTML = '<p style="opacity: 0.6; font-style: italic;">No cycle data yet. Add period start dates to track patterns.</p>';
    historyList.innerHTML = '';
    return;
  }
  
  const phaseEmojis = {
    menstrual: '🌙',
    follicular: '🌱',
    ovulatory: '🌸',
    luteal: '🍂'
  };
  
  infoDiv.innerHTML = `
    <div style="font-size: 1.1rem; margin-bottom: 8px;">
      ${phaseEmojis[cycle.phase]} <strong>${cycle.phase.charAt(0).toUpperCase() + cycle.phase.slice(1)} Phase</strong>
    </div>
    <div style="opacity: 0.7;">
      Day ${cycle.dayInCycle} of ~${cycle.avgCycleLength} day cycle
    </div>
    <div style="margin-top: 12px; font-size: 0.85rem; opacity: 0.6; font-style: italic;">
      This is context, not a rule. Your energy is yours to define.
    </div>
  `;
  
  // Show history
  historyList.innerHTML = appData.periodStarts
    .slice(-5)
    .reverse()
    .map(date => `
      <li class="cycle-history-item">
        ${getReadableDate(date)}
      </li>
    `).join('');
}

/* ========================================
   ENERGY-BASED SUCCESS LOGIC
   ======================================== */

const ENERGY_EXPECTATIONS = {
  high: {
    minTasks: 3,
    strongThreshold: 80,
    normalThreshold: 60
  },
  medium: {
    minTasks: 2,
    strongThreshold: 65,
    normalThreshold: 40
  },
  low: {
    minTasks: 1,
    strongThreshold: null,  // Not possible
    normalThreshold: 30
  }
};

function calculateDayLabel(day) {
  if (day.rest_day) {
    return 'rest';
  }
  
  // Count all completed tasks across all categories
  let completedCount = 0;
  let totalCount = 0;
  
  for (const category in day.tasks) {
    const tasks = day.tasks[category];
    totalCount += tasks.length;
    completedCount += tasks.filter(t => t.done).length;
  }
  
  // Minimum viable day: at least 1 task completed
  if (completedCount === 0) {
    return 'gentle';  // Showed up but didn't complete anything
  }
  
  if (totalCount === 0) {
    return 'gentle';  // No tasks set
  }
  
  const completionPercent = (completedCount / totalCount) * 100;
  day.daily_completion_percent = Math.round(completionPercent);
  
  const expectations = ENERGY_EXPECTATIONS[day.energy_level];
  
  // Strong day
  if (expectations.strongThreshold && completionPercent >= expectations.strongThreshold) {
    return 'strong';
  }
  
  // Normal day
  if (completionPercent >= expectations.normalThreshold) {
    return 'normal';
  }
  
  // Gentle day (showed up)
  return 'gentle';
}

function updateDayLabel() {
  const today = getToday();
  const day = getDayRecord(today);
  
  day.day_label = calculateDayLabel(day);
  saveData();
  
  const resultDiv = document.getElementById('day-result');
  const labels = {
    rest: { text: '🌙 Rest day - no expectations', class: 'rest' },
    gentle: { text: '🌱 Showing up is enough', class: 'gentle' },
    normal: { text: '🌿 Good day - steady progress', class: 'normal' },
    strong: { text: '🌳 Strong day - well done!', class: 'strong' }
  };
  
  const label = labels[day.day_label];
  resultDiv.textContent = label.text;
  resultDiv.className = `day-result ${label.class}`;
}

/* ========================================
   TASK MANAGEMENT
   ======================================== */

const TASK_CATEGORIES = {
  lessons: { parent: 'Studies', icon: '📚', label: 'Lessons' },
  homework: { parent: 'Studies', icon: '📚', label: 'Homework' },
  revision: { parent: 'Studies', icon: '📚', label: 'Revision' },
  korean: { parent: 'Languages', icon: '🇰🇷', label: 'Korean' },
  greek: { parent: 'Languages', icon: '🇬🇷', label: 'Greek' },
  hebrew: { parent: 'Languages', icon: '🇮🇱', label: 'Hebrew' },
  german: { parent: 'Languages', icon: '🇩🇪', label: 'German' },
  training: { parent: 'Other', icon: '🏋️', label: 'Training' },
  chores: { parent: 'Other', icon: '🏠', label: 'Chores' }
};

function openAddTask(category) {
  currentCategory = category;
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-deadline-input').value = '';
  
  // Show content type dropdown only for language categories
  const contentTypeSelect = document.getElementById('content-type-select');
  const languageCategories = ['korean', 'greek', 'hebrew', 'german'];
  
  if (languageCategories.includes(category)) {
    contentTypeSelect.style.display = 'block';
    contentTypeSelect.value = '';
  } else {
    contentTypeSelect.style.display = 'none';
  }
  
  document.getElementById('add-task-modal').classList.add('active');
}

function addTask() {
  let title = document.getElementById('task-title-input').value.trim();
  const deadline = document.getElementById('task-deadline-input').value;
  const contentType = document.getElementById('content-type-select').value;
  
  if (!title) {
    alert('Please enter a task description');
    return;
  }
  
  // For language categories, prepend content type if selected
  const languageCategories = ['korean', 'greek', 'hebrew', 'german'];
  if (languageCategories.includes(currentCategory) && contentType) {
    title = `${contentType}: ${title}`;
  }
  
  const today = getToday();
  const day = getDayRecord(today);
  
  const task = {
    id: Date.now(),
    text: title,
    deadline: deadline || null,
    done: false,
    createdAt: today
  };
  
  day.tasks[currentCategory].push(task);
  saveData();
  
  closeModal('add-task-modal');
  renderToday();
}

function toggleTask(category, taskId) {
  const today = getToday();
  const day = getDayRecord(today);
  const task = day.tasks[category].find(t => t.id === taskId);
  
  if (task) {
    task.done = !task.done;
    saveData();
    renderToday();
    updateDayLabel();
  }
}

function deleteTask(category, taskId) {
  const today = getToday();
  const day = getDayRecord(today);
  
  day.tasks[category] = day.tasks[category].filter(t => t.id !== taskId);
  saveData();
  renderToday();
  updateDayLabel();
}

function renderToday() {
  const today = getToday();
  const day = getDayRecord(today);
  
  // Update date
  document.getElementById('today-date').textContent = getReadableDate(today);
  
  // Update energy badge
  const badge = document.getElementById('energy-badge');
  badge.textContent = `Energy: ${day.energy_level.charAt(0).toUpperCase() + day.energy_level.slice(1)}`;
  
  // Update cycle phase
  const cycle = calculateCyclePhase(today);
  const phaseDiv = document.getElementById('cycle-phase');
  if (cycle) {
    const phaseEmojis = {
      menstrual: '🌙',
      follicular: '🌱',
      ovulatory: '🌸',
      luteal: '🍂'
    };
    phaseDiv.textContent = `${phaseEmojis[cycle.phase]} ${cycle.phase} phase (day ${cycle.dayInCycle})`;
    phaseDiv.style.display = 'block';
  } else {
    phaseDiv.style.display = 'none';
  }
  
  // Update energy buttons
  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.energy === day.energy_level);
  });
  
  // Update rest checkbox
  document.getElementById('rest-checkbox').checked = day.rest_day;
  
  // Update day label
  updateDayLabel();
  
  // Render tasks
  renderTasks(day);
}

function renderTasks(day) {
  const container = document.getElementById('tasks-container');
  
  // Group by parent category
  const groups = {
    'Studies': ['lessons', 'homework', 'revision'],
    'Languages': ['korean', 'greek', 'hebrew', 'german'],
    'Other': ['training', 'chores']
  };
  
  let html = '';
  
  for (const [groupName, categories] of Object.entries(groups)) {
    const groupIcon = groupName === 'Studies' ? '📚' : groupName === 'Languages' ? '🌍' : '✨';
    
    // Count tasks in group
    let groupTotal = 0;
    let groupCompleted = 0;
    categories.forEach(cat => {
      groupTotal += day.tasks[cat].length;
      groupCompleted += day.tasks[cat].filter(t => t.done).length;
    });
    
    html += `
      <details class="task-section" open>
        <summary>
          ${groupIcon} ${groupName}
          <span class="task-count">${groupCompleted}/${groupTotal}</span>
        </summary>
    `;
    
    categories.forEach(category => {
      const meta = TASK_CATEGORIES[category];
      const tasks = day.tasks[category];
      const completed = tasks.filter(t => t.done).length;
      const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
      
      html += `
        <details class="sub-card" open>
          <summary>
            ${meta.icon} ${meta.label}
            <span class="task-count">${completed}/${tasks.length}</span>
          </summary>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <ul class="task-list">
            ${tasks.map(task => `
              <li class="task-item">
                <input 
                  type="checkbox" 
                  ${task.done ? 'checked' : ''} 
                  onchange="toggleTask('${category}', ${task.id})"
                />
                <span class="task-text ${task.done ? 'completed' : ''}">${task.text}</span>
                ${task.deadline ? `<span class="task-deadline">${task.deadline}</span>` : ''}
                <button class="task-delete" onclick="deleteTask('${category}', ${task.id})">×</button>
              </li>
            `).join('')}
          </ul>
          <button class="add-task-btn" onclick="openAddTask('${category}')">
            + Add ${meta.label}
          </button>
        </details>
      `;
    });
    
    html += '</details>';
  }
  
  container.innerHTML = html;
}

/* ========================================
   ENERGY & REST MANAGEMENT
   ======================================== */

document.querySelectorAll('.energy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const energy = btn.dataset.energy;
    const today = getToday();
    const day = getDayRecord(today);
    
    day.energy_level = energy;
    saveData();
    renderToday();
  });
});

document.getElementById('rest-checkbox').addEventListener('change', (e) => {
  const today = getToday();
  const day = getDayRecord(today);
  
  day.rest_day = e.target.checked;
  saveData();
  updateDayLabel();
});

/* ========================================
   BRAIN VOMIT & EXTRACTION
   ======================================== */

function saveBrainVomit() {
  const input = document.getElementById('brain-input');
  const text = input.value.trim();
  
  if (!text) return;
  
  const entry = {
    id: Date.now(),
    text: text,
    date: getToday(),
    extracted: false
  };
  
  appData.brainVomit.unshift(entry);
  saveData();
  
  input.value = '';
  renderBrainVomit();
}

function renderBrainVomit() {
  const list = document.getElementById('brain-list');
  const empty = document.getElementById('brain-empty');
  
  if (appData.brainVomit.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  list.style.display = 'block';
  empty.style.display = 'none';
  
  list.innerHTML = appData.brainVomit.map(entry => `
    <li class="brain-item">
      <div class="brain-item-text">${entry.text}</div>
      <div class="brain-item-meta">${getReadableDate(entry.date)}</div>
      <div class="brain-item-actions">
        <button class="btn-sm" onclick="openExtractModal(${entry.id})">
          Extract as Task
        </button>
        <button class="btn-sm" onclick="deleteBrainItem(${entry.id})">
          Delete
        </button>
      </div>
    </li>
  `).join('');
}

function openExtractModal(brainId) {
  currentBrainItemId = brainId;
  const item = appData.brainVomit.find(b => b.id === brainId);
  
  document.getElementById('extract-text').textContent = item.text;
  document.getElementById('extract-category').value = 'lessons';
  document.getElementById('extract-deadline').value = '';
  
  document.getElementById('extract-modal').classList.add('active');
}

function extractTask() {
  const category = document.getElementById('extract-category').value;
  const deadline = document.getElementById('extract-deadline').value;
  
  const brainItem = appData.brainVomit.find(b => b.id === currentBrainItemId);
  
  if (!brainItem) return;
  
  const today = getToday();
  const day = getDayRecord(today);
  
  const task = {
    id: Date.now(),
    text: brainItem.text,
    deadline: deadline || null,
    done: false,
    createdAt: today,
    extractedFrom: currentBrainItemId
  };
  
  day.tasks[category].push(task);
  brainItem.extracted = true;
  
  saveData();
  closeModal('extract-modal');
  renderToday();
  renderBrainVomit();
}

function deleteBrainItem(id) {
  appData.brainVomit = appData.brainVomit.filter(b => b.id !== id);
  saveData();
  renderBrainVomit();
}

/* ========================================
   CALENDAR HEATMAP
   ======================================== */

function renderCalendar() {
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  
  document.getElementById('calendar-month').textContent = getMonthName(calendarViewDate);
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  
  // Add day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayLabels.forEach(label => {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.style.fontWeight = '500';
    div.style.fontSize = '0.8rem';
    div.style.opacity = '0.6';
    div.textContent = label;
    grid.appendChild(div);
  });
  
  // Add padding for first week
  for (let i = 0; i < startPadding; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
  }
  
  // Add days
  const today = getToday();
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dateObj = new Date(year, month, date);
    const dateStr = formatDate(dateObj);
    const day = appData.days[dateStr];
    
    const div = document.createElement('div');
    div.className = 'calendar-day';
    
    if (dateStr > today) {
      div.classList.add('future');
    } else if (day) {
      div.classList.add(day.day_label);
    } else {
      div.classList.add('gentle');  // Default for days without data
    }
    
    const emojis = {
      rest: '🌙',
      gentle: '🌱',
      normal: '🌿',
      strong: '🌳'
    };
    
    div.innerHTML = `
      <div class="day-number">${date}</div>
      <div class="day-emoji">${day ? emojis[day.day_label] : ''}</div>
    `;
    
    div.onclick = () => showDayDetail(dateStr);
    
    grid.appendChild(div);
  }
}

function changeMonth(direction) {
  calendarViewDate.setMonth(calendarViewDate.getMonth() + direction);
  renderCalendar();
}

function showDayDetail(dateStr) {
  const day = appData.days[dateStr];
  
  if (!day && dateStr > getToday()) {
    return;  // Future date
  }
  
  const title = document.getElementById('detail-title');
  const content = document.getElementById('day-detail-content');
  
  title.textContent = getReadableDate(dateStr);
  
  if (!day) {
    content.innerHTML = '<p style="opacity: 0.6; font-style: italic;">No data for this day</p>';
  } else {
    const labels = {
      rest: '🌙 Rest Day',
      gentle: '🌱 Gentle Day',
      normal: '🌿 Normal Day',
      strong: '🌳 Strong Day'
    };
    
    let html = `
      <div style="margin-bottom: 16px;">
        <strong>${labels[day.day_label]}</strong><br>
        Energy: ${day.energy_level}<br>
        Completion: ${day.daily_completion_percent}%
      </div>
    `;
    
    // Show tasks
    let taskCount = 0;
    for (const category in day.tasks) {
      taskCount += day.tasks[category].length;
    }
    
    if (taskCount > 0) {
      html += '<h4 style="margin-top: 16px;">Tasks</h4><ul style="list-style: none; padding-left: 0;">';
      for (const category in day.tasks) {
        day.tasks[category].forEach(task => {
          html += `<li style="padding: 4px 0;">${task.done ? '✓' : '○'} ${task.text}</li>`;
        });
      }
      html += '</ul>';
    }
    
    // Show reflections
    if (day.end_of_day_reflection.proud_of) {
      html += `
        <h4 style="margin-top: 16px;">Proud of</h4>
        <p style="font-style: italic; opacity: 0.8;">${day.end_of_day_reflection.proud_of}</p>
      `;
    }
    
    if (day.end_of_day_reflection.release) {
      html += `
        <h4 style="margin-top: 16px;">Released</h4>
        <p style="font-style: italic; opacity: 0.8;">${day.end_of_day_reflection.release}</p>
      `;
    }
    
    content.innerHTML = html;
  }
  
  document.getElementById('day-detail-modal').classList.add('active');
}

/* ========================================
   INSIGHTS & METRICS (Compassionate)
   ======================================== */

function renderInsights() {
  renderWeekMetrics();
  renderMonthMetrics();
  renderCycleInfo();
}

function renderWeekMetrics() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  let daysShowedUp = 0;
  let restDays = 0;
  let gentleDays = 0;
  let normalDays = 0;
  let strongDays = 0;
  
  for (let d = new Date(weekAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    const day = appData.days[dateStr];
    
    if (day) {
      daysShowedUp++;
      if (day.day_label === 'rest') restDays++;
      else if (day.day_label === 'gentle') gentleDays++;
      else if (day.day_label === 'normal') normalDays++;
      else if (day.day_label === 'strong') strongDays++;
    }
  }
  
  const container = document.getElementById('week-metrics');
  container.innerHTML = `
    <div class="metric-row">
      <span class="metric-label">Days you showed up</span>
      <span class="metric-value">${daysShowedUp}/7</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌙 Rest days</span>
      <span class="metric-value">${restDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌱 Gentle days</span>
      <span class="metric-value">${gentleDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌿 Normal days</span>
      <span class="metric-value">${normalDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌳 Strong days</span>
      <span class="metric-value">${strongDays}</span>
    </div>
  `;
}

function renderMonthMetrics() {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  let daysShowedUp = 0;
  let restDays = 0;
  let gentleDays = 0;
  let normalDays = 0;
  let strongDays = 0;
  
  for (let d = new Date(monthAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    const day = appData.days[dateStr];
    
    if (day) {
      daysShowedUp++;
      if (day.day_label === 'rest') restDays++;
      else if (day.day_label === 'gentle') gentleDays++;
      else if (day.day_label === 'normal') normalDays++;
      else if (day.day_label === 'strong') strongDays++;
    }
  }
  
  const container = document.getElementById('month-metrics');
  container.innerHTML = `
    <div class="metric-row">
      <span class="metric-label">Days you showed up</span>
      <span class="metric-value">${daysShowedUp}/30</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌙 Rest days</span>
      <span class="metric-value">${restDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌱 Gentle days</span>
      <span class="metric-value">${gentleDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌿 Normal days</span>
      <span class="metric-value">${normalDays}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">🌳 Strong days</span>
      <span class="metric-value">${strongDays}</span>
    </div>
  `;
}

/* ========================================
   END-OF-DAY CLOSURE
   ======================================== */

function saveClosure() {
  const proud = document.getElementById('proud-input').value.trim();
  const release = document.getElementById('release-input').value.trim();
  
  const today = getToday();
  const day = getDayRecord(today);
  
  day.end_of_day_reflection.proud_of = proud;
  day.end_of_day_reflection.release = release;
  
  saveData();
  
  // Clear inputs
  document.getElementById('proud-input').value = '';
  document.getElementById('release-input').value = '';
  
  // Show confirmation
  alert('Day closed. Rest well. 🌙');
}

/* ========================================
   PAGE NAVIGATION
   ======================================== */

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  document.getElementById(pageId).classList.add('active');
  
  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.closest('.nav-item').classList.add('active');
  
  // Render page-specific content
  if (pageId === 'brain-page') {
    renderBrainVomit();
  } else if (pageId === 'calendar-page') {
    renderCalendar();
  } else if (pageId === 'insights-page') {
    renderInsights();
  } else if (pageId === 'closure-page') {
    const today = getToday();
    const day = getDayRecord(today);
    document.getElementById('proud-input').value = day.end_of_day_reflection.proud_of || '';
    document.getElementById('release-input').value = day.end_of_day_reflection.release || '';
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================================
   MODAL MANAGEMENT
   ======================================== */

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

/* ========================================
   INITIALIZATION
   ======================================== */

function init() {
  loadData();
  renderToday();
  
  console.log('Mental Load Keeper V3 initialized ✨');
  console.log('Philosophy: Compassion over optimization');
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
