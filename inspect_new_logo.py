import cv2
import numpy as np

img = cv2.imread(r"C:\Users\ASDS\.gemini\antigravity\brain\864481ff-2f4f-40ff-914d-68492762179c\media__1781186689549.png", cv2.IMREAD_UNCHANGED)
h, w, c = img.shape
print(f"Shape: {img.shape}")

# Let's inspect some coordinates
# Let's look at the corners
print("Corners:")
print("Top-left:", img[0, 0])
print("Top-right:", img[0, w-1])
print("Bottom-left:", img[h-1, 0])
print("Bottom-right:", img[h-1, w-1])

# Let's find dark pixels
# Since it's a black/dark gradient background, let's check values
gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
print("Max gray value:", gray.max())
print("Min gray value:", gray.min())

# Let's see how many pixels are very dark (e.g. <= 30)
dark_mask = (gray <= 30).astype(np.uint8) * 255
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(dark_mask)
print(f"Connected components of dark pixels (<= 30): {num_labels}")

for label in range(num_labels):
    area = stats[label, cv2.CC_STAT_AREA]
    cx, cy = centroids[label]
    print(f"Label {label}: Area={area}, Centroid=({cx:.1f}, {cy:.1f})")
