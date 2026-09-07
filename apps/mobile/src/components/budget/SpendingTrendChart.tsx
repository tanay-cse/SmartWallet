import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { SpendingTrendPoint } from '../../types/budget';

type SpendingTrendChartProps = {
  data?: SpendingTrendPoint[];
};

type RangeOption = '1W' | '1M' | '3M' | '1Y' | 'ALL';

const TIMEFRAME_DATA: Record<
  RangeOption,
  { subtitle: string; points: SpendingTrendPoint[] }
> = {
  '1W': {
    subtitle: '7-day daily velocity',
    points: [
      { date: 'Mon', day: 1, amount: 920 },
      { date: 'Tue', day: 2, amount: 1450 },
      { date: 'Wed', day: 3, amount: 840 },
      { date: 'Thu', day: 4, amount: 2100 },
      { date: 'Fri', day: 5, amount: 3450, isPeak: true },
      { date: 'Sat', day: 6, amount: 2800 },
      { date: 'Sun', day: 7, amount: 1200 },
    ],
  },
  '1M': {
    subtitle: 'March daily velocity',
    points: [
      { date: '01 Mar', day: 1, amount: 650 },
      { date: '03 Mar', day: 3, amount: 1100 },
      { date: '06 Mar', day: 6, amount: 4800 },
      { date: '08 Mar', day: 8, amount: 2100 },
      { date: '10 Mar', day: 10, amount: 1400 },
      { date: '11 Mar', day: 11, amount: 5010, isPeak: true },
      { date: '13 Mar', day: 13, amount: 1800 },
      { date: '16 Mar', day: 16, amount: 950 },
      { date: '19 Mar', day: 19, amount: 2600 },
      { date: '21 Mar', day: 21, amount: 1750 },
      { date: '24 Mar', day: 24, amount: 3200 },
      { date: '27 Mar', day: 27, amount: 2100 },
      { date: '30 Mar', day: 30, amount: 3900 },
    ],
  },
  '3M': {
    subtitle: '90-day weekly velocity',
    points: [
      { date: 'Jan W1', day: 1, amount: 4200 },
      { date: 'Jan W2', day: 2, amount: 5100 },
      { date: 'Jan W3', day: 3, amount: 3800 },
      { date: 'Jan W4', day: 4, amount: 6100, isPeak: true },
      { date: 'Feb W1', day: 5, amount: 3400 },
      { date: 'Feb W2', day: 6, amount: 4200 },
      { date: 'Feb W3', day: 7, amount: 3900 },
      { date: 'Feb W4', day: 8, amount: 3300 },
      { date: 'Mar W1', day: 9, amount: 4800 },
      { date: 'Mar W2', day: 10, amount: 5400 },
      { date: 'Mar W3', day: 11, amount: 4100 },
      { date: 'Mar W4', day: 12, amount: 4600 },
    ],
  },
  '1Y': {
    subtitle: '12-month trend',
    points: [
      { date: 'Apr 25', day: 1, amount: 16200 },
      { date: 'May 25', day: 2, amount: 14800 },
      { date: 'Jun 25', day: 3, amount: 17500 },
      { date: 'Jul 25', day: 4, amount: 15300 },
      { date: 'Aug 25', day: 5, amount: 18900 },
      { date: 'Sep 25', day: 6, amount: 14100 },
      { date: 'Oct 25', day: 7, amount: 21000, isPeak: true },
      { date: 'Nov 25', day: 8, amount: 19400 },
      { date: 'Dec 25', day: 9, amount: 20500 },
      { date: 'Jan 26', day: 10, amount: 19200 },
      { date: 'Feb 26', day: 11, amount: 14800 },
      { date: 'Mar 26', day: 12, amount: 18500 },
    ],
  },
  'ALL': {
    subtitle: 'All-time spending baseline',
    points: [
      { date: '2023 H1', day: 1, amount: 64000 },
      { date: '2023 H2', day: 2, amount: 78000 },
      { date: '2024 H1', day: 3, amount: 85000 },
      { date: '2024 H2', day: 4, amount: 92000 },
      { date: '2025 H1', day: 5, amount: 105000 },
      { date: '2025 H2', day: 6, amount: 118000, isPeak: true },
      { date: '2026 Q1', day: 7, amount: 52500 },
    ],
  },
};

export function SpendingTrendChart({ data: initialData }: SpendingTrendChartProps) {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('1M');
  const [activePointIndex, setActivePointIndex] = useState<number>(5);

  const ranges: RangeOption[] = ['1W', '1M', '3M', '1Y', 'ALL'];
  const chartWidth = 320;
  const chartHeight = 160;

  // Active dataset based on selected range
  const currentDataset = useMemo(() => {
    return TIMEFRAME_DATA[selectedRange] || TIMEFRAME_DATA['1M'];
  }, [selectedRange]);

  const activeData = currentDataset.points;

  // Dynamically calculate peak & coordinate scaling
  const maxAmount = useMemo(() => {
    const max = Math.max(...activeData.map((d) => d.amount));
    return max * 1.15; // 15% headroom
  }, [activeData]);

  // Calculate coordinates for smooth curve
  const points = useMemo(() => {
    return activeData.map((item, index) => {
      const x = (index / (activeData.length - 1)) * chartWidth;
      const y = 145 - (item.amount / maxAmount) * 115;
      return { x, y, ...item };
    });
  }, [activeData, maxAmount]);

  // Generate smooth bezier path
  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  const areaPath = `${linePath} L ${chartWidth} 150 L 0 150 Z`;

  // Safe active point
  const safeIndex = Math.min(activePointIndex, points.length - 1);
  const activePoint = points[safeIndex] || points[0];

  const handleSelectRange = (range: RangeOption) => {
    setSelectedRange(range);
    // Set middle or peak point as active for the new dataset
    const newPoints = TIMEFRAME_DATA[range].points;
    const peakIdx = newPoints.findIndex((p) => p.isPeak);
    setActivePointIndex(peakIdx >= 0 ? peakIdx : Math.floor(newPoints.length / 2));
  };

  return (
    <View style={styles.container}>
      {/* Chart Section Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <Text style={styles.subtitle}>{currentDataset.subtitle}</Text>
        </View>

        {/* Minimal Timeframe Selector */}
        <View style={styles.rangeSelector}>
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <TouchableOpacity
                key={range}
                style={[styles.rangeTab, isActive && styles.rangeTabActive]}
                onPress={() => handleSelectRange(range)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeText, isActive && styles.rangeTextActive]}>
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Modern Minimalist SVG Chart */}
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            {/* Forest Green Gradient Fill */}
            <LinearGradient id="minimalGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.forestGreen} stopOpacity="0.14" />
              <Stop offset="100%" stopColor={Colors.forestGreen} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Baseline */}
          <Line
            x1="0"
            y1="150"
            x2={chartWidth}
            y2="150"
            stroke={Colors.borderLight}
            strokeWidth="1"
          />

          {/* Area fill under curve */}
          <Path d={areaPath} fill="url(#minimalGrad)" />

          {/* Smooth Continuous Line */}
          <Path
            d={linePath}
            fill="none"
            stroke={Colors.forestGreen}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Vertical Guideline */}
          {activePoint && (
            <Line
              x1={activePoint.x}
              y1={activePoint.y}
              x2={activePoint.x}
              y2="150"
              stroke={Colors.slateExpense}
              strokeWidth="1"
              strokeDasharray="3, 3"
              opacity={0.35}
            />
          )}

          {/* Active Anchor Dot */}
          {activePoint && (
            <>
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill={Colors.forestGreen}
                opacity={0.18}
              />
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="3.5"
                fill={Colors.forestGreen}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </>
          )}
        </Svg>

        {/* Clean Interactive Floating Tooltip */}
        {activePoint && (
          <View
            style={[
              styles.tooltipBubble,
              {
                left: Math.max(10, Math.min(chartWidth - 95, activePoint.x - 45)),
                top: Math.max(0, activePoint.y - 42),
              },
            ]}
          >
            <Text style={styles.tooltipAmount}>
              ₹{activePoint.amount.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.tooltipDate}>{activePoint.date}</Text>
          </View>
        )}

        {/* Touch Scrub Interaction Overlay */}
        <View style={styles.touchOverlay}>
          {points.map((pt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.touchColumn}
              onPress={() => setActivePointIndex(index)}
              activeOpacity={1}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 2,
  },
  rangeTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  rangeTabActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  rangeTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  chartWrapper: {
    position: 'relative',
    height: 160,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  touchColumn: {
    flex: 1,
    height: '100%',
  },
  tooltipBubble: {
    position: 'absolute',
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 80,
  },
  tooltipAmount: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  tooltipDate: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
});
