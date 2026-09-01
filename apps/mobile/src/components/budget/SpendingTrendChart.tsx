import React, { useState } from 'react';
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
  data: SpendingTrendPoint[];
};

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const [activePointIndex, setActivePointIndex] = useState<number>(5);
  const [selectedRange, setSelectedRange] = useState<string>('1M');

  const ranges = ['1W', '1M', '3M', '1Y', 'ALL'];
  const chartWidth = 320;
  const chartHeight = 160;

  // Calculate coordinates for smooth curve
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const clampedAmount = Math.min(item.amount, 6000);
    const y = 145 - (clampedAmount / 5500) * 115;
    return { x, y, ...item };
  });

  // Generate smooth bezier path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${chartWidth} 150 L 0 150 Z`;

  const activePoint = points[activePointIndex] || points[0];

  return (
    <View style={styles.container}>
      {/* Chart Section Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <Text style={styles.subtitle}>Daily velocity</Text>
        </View>

        {/* Coinbase Style Minimal Timeframe Selector */}
        <View style={styles.rangeSelector}>
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <TouchableOpacity
                key={range}
                style={[styles.rangeTab, isActive && styles.rangeTabActive]}
                onPress={() => setSelectedRange(range)}
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
            {/* Subtle Forest Green Gradient Fill */}
            <LinearGradient id="minimalGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.forestGreen} stopOpacity="0.12" />
              <Stop offset="100%" stopColor={Colors.forestGreen} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Single Subtle Baseline */}
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

          {/* Smooth Continuous Line (Forest Green) */}
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
              opacity={0.4}
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
                left: Math.max(10, Math.min(chartWidth - 100, activePoint.x - 45)),
                top: Math.max(0, activePoint.y - 42),
              },
            ]}
          >
            <Text style={styles.tooltipAmount}>₹{activePoint.amount.toLocaleString('en-IN')}</Text>
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
    paddingHorizontal: 10,
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
