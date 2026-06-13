import cv2
import numpy as np

# Load the tight logo
img = cv2.imread(r"c:\Users\ASDS\Desktop\REPTIME\modurep\public\logo-tight.png", cv2.IMREAD_UNCHANGED)
h, w, c = img.shape

# Threshold to find white/near-white pixels for connected components
bg_threshold = 235
is_white = (img[:, :, 0] >= bg_threshold) & (img[:, :, 1] >= bg_threshold) & (img[:, :, 2] >= bg_threshold)
white_mask = is_white.astype(np.uint8) * 255

# Find connected components of white pixels
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(white_mask)

# Find the clock face component
clock_label = None
for label in range(1, num_labels):
    area = stats[label, cv2.CC_STAT_AREA]
    cx, cy = centroids[label]
    # Clock face criteria: X centroid < w * 0.4 and Y centroid > h * 0.4 and area > 80000
    if cx < w * 0.4 and cy > h * 0.4 and area > 80000:
        clock_label = label
        print(f"Found clock face: Label={label}, Area={area}, Centroid=({cx:.1f}, {cy:.1f})")
        break

# Create mask for clock face
clock_mask = np.zeros((h, w), dtype=bool)
if clock_label is not None:
    clock_mask = (labels == clock_label)

# Calculate soft alpha channel for all other pixels
# val is the average intensity of RGB
val = (img[:, :, 0].astype(float) + img[:, :, 1].astype(float) + img[:, :, 2].astype(float)) / 3.0

# Initialize alpha
alpha = np.zeros((h, w), dtype=np.uint8)

# Foreground (low val) is fully opaque (255)
# Background (high val) is fully transparent (0)
# We interpolate in between (e.g. from 210 to 253)
fg_thresh = 210.0
bg_thresh = 253.0

mask_fg = val <= fg_thresh
mask_bg = val >= bg_thresh
mask_mid = (val > fg_thresh) & (val < bg_thresh)

alpha[mask_fg] = 255
alpha[mask_bg] = 0
# Interpolation
alpha[mask_mid] = ((bg_thresh - val[mask_mid]) / (bg_thresh - fg_thresh) * 255.0).astype(np.uint8)

# Force clock face to be fully opaque
alpha[clock_mask] = 255

# Create the output image
out_img = np.zeros((h, w, 4), dtype=np.uint8)
out_img[:, :, :3] = img[:, :, :3]
out_img[:, :, 3] = alpha

# Recolor the navy blue text "모두의 렙" to white
# Navy blue pixels are where Blue > Red + 10 and they are not transparent
blue_channel = out_img[:, :, 0].astype(float)
red_channel = out_img[:, :, 2].astype(float)
is_navy = (blue_channel > red_channel + 10) & (out_img[:, :, 3] > 0)

# Set navy pixels to clean premium white [250, 250, 250]
out_img[is_navy, 0] = 250  # Blue
out_img[is_navy, 1] = 250  # Green
out_img[is_navy, 2] = 250  # Red

# Save the processed logo
cv2.imwrite("c:\\Users\\ASDS\\Desktop\\REPTIME\\modurep\\public\\logo-processed.png", out_img)
print("Saved logo-processed.png")

# Now resize it to 600px width with high-quality interpolation
target_w = 600
target_h = int(h * (target_w / w))
resized = cv2.resize(out_img, (target_w, target_h), interpolation=cv2.INTER_AREA)

cv2.imwrite("c:\\Users\\ASDS\\Desktop\\REPTIME\\modurep\\public\\logo.png", resized)
print(f"Saved logo.png (resized to {target_w}x{target_h})")
