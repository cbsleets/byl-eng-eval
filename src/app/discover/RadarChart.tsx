"use client";

import { useMemo } from "react";

type RoleScore = {
  id: string;
  name: string;
  score: number;
};

type Props = {
  roles: RoleScore[];
  size?: number;
  colors?: {
    bg: string;
    border: string;
    fill: string;
    text: string;
    gridLines: string;
  };
};

// Default colors
const defaultColors = {
  bg: "#F5F3EE",
  border: "#8B7355",
  fill: "rgba(139, 115, 85, 0.3)",
  text: "#2D3A2D",
  gridLines: "#D1D5DB",
};

export default function RadarChart({ 
  roles, 
  size = 400,
  colors = defaultColors 
}: Props) {
  const center = size / 2;
  const radius = size * 0.28; // Smaller radius to leave more room for labels
  const levels = 5; // Number of concentric rings (20, 40, 60, 80, 100)

  // Calculate points for each role
  const points = useMemo(() => {
    const angleStep = (2 * Math.PI) / roles.length;
    // Start from top (-90 degrees)
    const startAngle = -Math.PI / 2;

    return roles.map((role, index) => {
      const angle = startAngle + index * angleStep;
      const normalizedScore = role.score / 100;
      const x = center + radius * normalizedScore * Math.cos(angle);
      const y = center + radius * normalizedScore * Math.sin(angle);
      
      // Label position (further outside the chart)
      const labelRadius = radius + 55;
      const labelX = center + labelRadius * Math.cos(angle);
      const labelY = center + labelRadius * Math.sin(angle);

      // Axis endpoint (at 100%)
      const axisX = center + radius * Math.cos(angle);
      const axisY = center + radius * Math.sin(angle);

      // Calculate if label is at top, bottom, left, right, or diagonal
      const angleDeg = (angle * 180 / Math.PI + 360) % 360;
      const isTop = angleDeg > 250 || angleDeg < 110;
      const isBottom = angleDeg > 70 && angleDeg < 290;

      return {
        ...role,
        x,
        y,
        labelX,
        labelY,
        axisX,
        axisY,
        angle,
        angleDeg,
        isTop,
        isBottom,
      };
    });
  }, [roles, center, radius]);

  // Create the polygon path for the data
  const polygonPath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  // Create concentric rings
  const rings = Array.from({ length: levels }, (_, i) => {
    const ringRadius = radius * ((i + 1) / levels);
    const ringPoints = points.map((p) => {
      const x = center + ringRadius * Math.cos(p.angle);
      const y = center + ringRadius * Math.sin(p.angle);
      return `${x},${y}`;
    });
    return ringPoints.join(' ');
  });

  return (
    <div className="relative inline-block">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background circle (optional) */}
        <circle
          cx={center}
          cy={center}
          r={radius + 10}
          fill={colors.bg}
          opacity={0.5}
        />

        {/* Concentric ring grid */}
        {rings.map((ring, i) => (
          <polygon
            key={`ring-${i}`}
            points={ring}
            fill="none"
            stroke={colors.gridLines}
            strokeWidth={1}
            opacity={0.6}
          />
        ))}

        {/* Axis lines from center to each point */}
        {points.map((point, i) => (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={point.axisX}
            y2={point.axisY}
            stroke={colors.gridLines}
            strokeWidth={1}
            opacity={0.6}
          />
        ))}

        {/* Data polygon (filled area) */}
        <path
          d={polygonPath}
          fill={colors.fill}
          stroke={colors.border}
          strokeWidth={2}
          className="transition-all duration-500"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={colors.border}
            stroke="white"
            strokeWidth={2}
            className="transition-all duration-500"
          />
        ))}

        {/* Labels */}
        {points.map((point, i) => {
          // Adjust text anchor based on horizontal position
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (point.labelX < center - 20) textAnchor = "end";
          else if (point.labelX > center + 20) textAnchor = "start";

          // Calculate vertical offset for the label group
          // Labels at top should have text below, labels at bottom should have text above
          const isNearTop = point.labelY < center - radius * 0.3;
          const isNearBottom = point.labelY > center + radius * 0.3;
          
          // Percentage offset from name
          const percentOffsetY = isNearBottom ? -18 : 18;
          
          // Adjust label Y position
          let adjustedLabelY = point.labelY;
          if (isNearTop) adjustedLabelY -= 5;
          if (isNearBottom) adjustedLabelY += 5;

          return (
            <g key={`label-${i}`}>
              {/* Role name */}
              <text
                x={point.labelX}
                y={adjustedLabelY}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-xs font-semibold"
                fill={colors.text}
              >
                {point.name}
              </text>
              {/* Score percentage */}
              <text
                x={point.labelX}
                y={adjustedLabelY + percentOffsetY}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-xs"
                fill={colors.text}
                opacity={0.6}
              >
                {point.score}%
              </text>
            </g>
          );
        })}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r={3}
          fill={colors.gridLines}
        />
      </svg>
    </div>
  );
}

