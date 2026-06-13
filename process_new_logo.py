import cv2
import numpy as np

# Load the new logo image
img = cv2.imread(r"C:\Users\ASDS\.gemini\antigravity\brain\864481ff-2f4f-40ff-914d-68492762179c\media__1781186689549.png")
h, w, c = img.shape

# Crop boundaries
crop_y1, crop_y2 = 135, 395
crop_x1, crop_x2 = 190, 830

cropped = img[crop_y1:crop_y2, crop_x1:crop_x2].copy()
ch, cw, cc = cropped.shape
print(f"Cropped shape: {cropped.shape}")

# Convert to grayscale to compute alpha
gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)

# Initialize alpha channel
alpha = np.zeros((ch, cw), dtype=np.uint8)

# Calculate soft alpha based on grayscale value
# Dark pixels (<= 8) are background (transparent, alpha=0)
# Bright pixels (>= 35) are foreground (opaque, alpha=255)
# In-between pixels are interpolated for smooth edges
bg_thresh = 8.0
fg_thresh = 35.0

mask_fg = gray >= fg_thresh
mask_bg = gray <= bg_thresh
mask_mid = (gray > bg_thresh) & (gray < fg_thresh)

alpha[mask_fg] = 255
alpha[mask_bg] = 0
alpha[mask_mid] = ((gray[mask_mid] - bg_thresh) / (fg_thresh - bg_thresh) * 255.0).astype(np.uint8)

# Now define the clock face circle in crop coordinates
# Original circle was Center=(314, 284), Radius=70
cx_crop = 314 - crop_x1
cy_crop = 284 - crop_y1
radius = 69

# Create a circular mask for the clock face
y_indices, x_indices = np.ogrid[:ch, :cw]
dist_from_center = np.sqrt((x_indices - cx_crop)**2 + (y_indices - cy_crop)**2)
clock_mask = dist_from_center <= radius

# Force the clock face pixels to be fully opaque (255)
alpha[clock_mask] = 255

# Create the final RGBA image
out_img = np.zeros((ch, cw, 4), dtype=np.uint8)
out_img[:, :, :3] = cropped
out_img[:, :, 3] = alpha

# Save the high-resolution processed logo
cv2.imwrite("c:\\Users\\ASDS\\Desktop\\REPTIME\\modurep\\public\\logo-processed.png", out_img)
print("Saved logo-processed.png")

# Resize to 600px width with high-quality interpolation
target_w = 600
target_h = int(ch * (target_w / cw))
resized = cv2.resize(out_img, (target_w, target_h), interpolation=cv2.INTER_AREA)

cv2.imwrite("c:\\Users\\ASDS\\Desktop\\REPTIME\\modurep\\public\\logo.png", resized)
print(f"Saved logo.png (resized to {target_w}x{target_h})")
