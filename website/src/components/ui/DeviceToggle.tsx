import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import type { DeviceToggleProps } from "config";

const DeviceToggle = ({ activeDevice, onToggle }: DeviceToggleProps) => {
	const handleAndroidToggle = useCallback(() => onToggle("android"), [onToggle]);
	const handleTabletToggle = useCallback(() => onToggle("tablet"), [onToggle]);

	return (
		<div className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-1">
			<DeviceButton
				isActive={activeDevice === "android"}
				onClick={handleAndroidToggle}
				label="Android"
			/>
			<DeviceButton
				isActive={activeDevice === "tablet"}
				onClick={handleTabletToggle}
				label="Tablet"
			/>
		</div>
	);
};

interface DeviceButtonProps {
	isActive: boolean;
	onClick: () => void;
	label: string;
}

const DeviceButton = memo(({ isActive, onClick, label }: DeviceButtonProps) => (
	<motion.button
		type="button"
		onClick={onClick}
		className={`relative rounded-md px-3.5 py-1.5 text-sm transition-colors ${
			isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
		}`}
		whileTap={{ scale: 0.95 }}
	>
		{isActive && (
			<motion.div
				layoutId="activeDevice"
				className="absolute inset-0 rounded-md bg-gray-200"
				transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
			/>
		)}
		<span className="relative z-10">{label}</span>
	</motion.button>
));

DeviceButton.displayName = "DeviceButton";

export default memo(DeviceToggle);
