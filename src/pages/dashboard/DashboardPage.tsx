import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { FiBookOpen, FiBriefcase, FiShield, FiUsers, FiTrendingUp } from 'react-icons/fi';

import { PageHeader } from '../../shared/ui/PageHeader';
import { useAuthStore } from '../../features/auth/model/authStore';
import { usersApi } from '../../entities/user/api/usersApi';
import { blogApi } from '../../entities/blog/api/blogApi';
import { casesApi } from '../../entities/case/api/casesApi';
import { blacklistApi } from '../../entities/blacklist/api/blacklistApi';
import { activityLogsApi } from '../../entities/activity-log/api/activityLogsApi';

type MonthStat = {
  name: string;
  year: number;
  monthIndex: number;
  count: number;
};

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  
  const [stats, setStats] = useState({
    usersCount: null as number | null,
    articlesCount: 0,
    casesCount: 0,
    blacklistCount: null as number | null,
  });

  const [monthlyTimeline, setMonthlyTimeline] = useState<MonthStat[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      const results = await Promise.allSettled([
        user?.role === 'admin' ? usersApi.getAll() : Promise.reject('Forbidden'),
        blogApi.getAdminAll(),
        casesApi.getAll(),
        user?.role === 'admin' ? blacklistApi.getAll() : Promise.reject('Forbidden'),
        user?.role === 'admin' ? activityLogsApi.getAll({ limit: 100 }) : Promise.reject('Forbidden'),
      ]);

      const fetchedUsers = results[0].status === 'fulfilled' ? results[0].value : [];
      const fetchedArticles = results[1].status === 'fulfilled' ? results[1].value : [];
      const fetchedCases = results[2].status === 'fulfilled' ? results[2].value : [];
      const fetchedBlacklist = results[3].status === 'fulfilled' ? (results[3].value.items ?? []) : [];
      const fetchedLogs = results[4].status === 'fulfilled' ? (results[4].value.items ?? []) : [];

      // 1. Calculate main card stats counts
      setStats({
        usersCount: results[0].status === 'fulfilled' ? fetchedUsers.length : null,
        articlesCount: fetchedArticles.length,
        casesCount: fetchedCases.length,
        blacklistCount: results[3].status === 'fulfilled' ? fetchedBlacklist.length : null,
      });

      // 2. Generate and calculate the last 6 months timeline dynamically
      const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
      const timeline: MonthStat[] = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const m = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        timeline.push({
          name: months[m.getMonth()],
          year: m.getFullYear(),
          monthIndex: m.getMonth(),
          count: 0,
        });
      }

      // Combine articles and cases to show total publication dynamics
      const allContent = [...fetchedArticles, ...fetchedCases];
      allContent.forEach((item) => {
        if (!item.createdAt) return;
        const itemDate = new Date(item.createdAt);
        timeline.forEach((slot) => {
          if (itemDate.getMonth() === slot.monthIndex && itemDate.getFullYear() === slot.year) {
            slot.count++;
          }
        });
      });
      setMonthlyTimeline(timeline);

      // 3. Calculate weekly activity log intensity dynamically
      const weeklyCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun
      
      if (user?.role === 'admin' && fetchedLogs.length > 0) {
        // Calculate based on actual system activity logs
        fetchedLogs.forEach((log: any) => {
          if (!log.createdAt) return;
          const day = new Date(log.createdAt).getDay(); // 0 = Sun, 1 = Mon...
          const index = day === 0 ? 6 : day - 1; // map Sunday to index 6, Monday to index 0
          weeklyCounts[index]++;
        });
      } else {
        // Fallback for authors: calculate based on their own article additions
        fetchedArticles.forEach((article) => {
          if (!article.createdAt) return;
          const day = new Date(article.createdAt).getDay();
          const index = day === 0 ? 6 : day - 1;
          weeklyCounts[index]++;
        });
      }
      setWeeklyActivity(weeklyCounts);
      
      setLoading(false);
    };

    void loadDashboardData();
  }, [user]);

  // Statistics cards configurations
  const statCards = [
    {
      label: 'Користувачі',
      value: stats.usersCount !== null ? stats.usersCount : '-',
      icon: <FiUsers size={28} />,
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    },
    {
      label: 'Статті Блогу',
      value: stats.articlesCount,
      icon: <FiBookOpen size={28} />,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    },
    {
      label: 'Публічні Кейси',
      value: stats.casesCount,
      icon: <FiBriefcase size={28} />,
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    },
    {
      label: 'Чорний список IP',
      value: stats.blacklistCount !== null ? stats.blacklistCount : '-',
      icon: <FiShield size={28} />,
      color: '#ef4444',
      bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    },
  ];

  // Dynamic SVG path calculations for the line chart
  const maxLineCount = Math.max(...monthlyTimeline.map((m) => m.count), 1);
  const lineCoords = monthlyTimeline.map((m, i) => ({
    x: 20 + i * 112,
    y: 190 - (m.count / maxLineCount) * 140,
    count: m.count,
  }));

  const linePath = lineCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = lineCoords.length > 0 ? `${linePath} L ${lineCoords[lineCoords.length - 1].x} 190 L ${lineCoords[0].x} 190 Z` : '';

  // Dynamic SVG bar calculations for the bar chart
  const maxBarCount = Math.max(...weeklyActivity, 1);

  return (
    <>
      <PageHeader title="Панель керування" subtitle="Керування контентом публічного сайту та безпекою." />
      
      {/* 1. Statistics Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{
              background: card.bgGradient,
              borderRadius: 3,
              boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 75,
                height: 75,
                background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                borderRadius: '50%',
              }
            }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack spacing={0.5}>
                    <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                      {loading ? '...' : card.value}
                    </Typography>
                  </Stack>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#ffffff',
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 2. Interactive SVG Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* SVG Line Chart: Publications dynamics */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Stack spacing={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Динаміка публікацій контенту
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Реальна кількість опублікованих статей та кейсів по місяцях (за останні 6 міс.)
                </Typography>
              </Stack>
              <Chip icon={<FiTrendingUp />} label="Актуальні дані" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            </Stack>
            
            <Box sx={{ width: '100%', height: 260, position: 'relative' }}>
              <svg viewBox="0 0 600 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Glowing background under the line */}
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="20" y1="40" x2="580" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="90" x2="580" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="140" x2="580" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="190" x2="580" y2="190" stroke="#cbd5e1" strokeWidth="1" />

                {/* Area beneath the curve */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#chart-glow)"
                  />
                )}

                {/* Main line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive markers */}
                {lineCoords.map((coords, i) => (
                  <g key={i}>
                    <circle cx={coords.x} cy={coords.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    {/* Tooltip number showing real count above the dot */}
                    <text x={coords.x} y={coords.y - 12} fill="#1e293b" fontSize="10" fontWeight="800" textAnchor="middle">
                      {coords.count}
                    </text>
                  </g>
                ))}

                {/* X-axis labels */}
                {monthlyTimeline.map((slot, i) => (
                  <text key={i} x={20 + i * 112} y={210} fill="#94a3b8" fontSize="11" textAnchor="middle">
                    {slot.name}
                  </text>
                ))}
              </svg>
            </Box>
          </Paper>
        </Grid>

        {/* SVG Bar Chart: Weekly Activity Levels */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Інтенсивність дій у системі
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === 'admin' 
                  ? 'Реальна кількість останніх 100 дій в логах за днями тижня'
                  : 'Загальна кількість створених вами статей за днями тижня'}
              </Typography>
            </Stack>

            <Box sx={{ width: '100%', height: 260 }}>
              <svg viewBox="0 0 320 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
                {/* Horizontal Baseline */}
                <line x1="10" y1="190" x2="310" y2="190" stroke="#cbd5e1" strokeWidth="1" />

                {/* Vertical Bars */}
                {weeklyActivity.map((count, i) => {
                  // Scale bar height dynamically, give a minimum height of 4px if there's any data to make it look responsive
                  const height = count > 0 ? (count / maxBarCount) * 140 : 4; 
                  const y = 190 - height;
                  const x = 25 + i * 40;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width="22"
                        height={height}
                        rx="4"
                        fill={count > 0 ? '#3b82f6' : '#cbd5e1'}
                        opacity={i >= 5 ? 0.6 : count > 0 ? 0.9 : 0.4}
                      />
                      {/* Show action counts above each bar */}
                      <text x={x + 11} y={y - 8} fill="#475569" fontSize="10" fontWeight="700" textAnchor="middle">
                        {count}
                      </text>
                    </g>
                  );
                })}

                {/* Labels */}
                <text x="36" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Пн</text>
                <text x="76" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Вт</text>
                <text x="116" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Ср</text>
                <text x="156" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Чт</text>
                <text x="196" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Пт</text>
                <text x="236" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Сб</text>
                <text x="276" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">Нд</text>
              </svg>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
