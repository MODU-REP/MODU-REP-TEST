import cv2
import numpy as np

img = cv2.imread(r"C:\Users\ASDS\.gemini\antigravity\brain\864481ff-2f4f-40ff-914d-68492762179c\media__1781187498807.jpg")
h, w, c = img.shape
print(f"Shape: {img.shape}")

# Find circles using HoughCircles
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
circles = cv2.HoughCircles(
    gray, 
    cv2.HOUGH_GRADIENT, 
    dp=1, 
    minDist=100,
    param1=50, 
    param2=25, 
    minRadius=30, 
    maxRadius=120
)

if circles is not None:
    circles = np.uint16(np.around(circles))
    print(f"Found {len(circles[0])} circles:")
    for idx, i in enumerate(circles[0]):
        print(f"Circle {idx}: Center=({i[0]}, {i[1]}), Radius={i[2]}")
else:
    print("No circles found using HoughCircles!")

# Let's check the bounding box of non-black pixels
fg_mask = (img[:, :, 0] > 30) | (img[:, :, 1] > 30) | (img[:, :, 2] > 30)
y_idx, x_idx = np.where(fg_mask)
if len(y_idx) > 0:
    print(f"Foreground BBox: Y=[{y_idx.min()}, {y_idx.max()}], X=[{x_idx.min()}, {x_idx.max()}]")
