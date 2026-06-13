import cv2
import numpy as np

img = cv2.imread(r"C:\Users\ASDS\.gemini\antigravity\brain\864481ff-2f4f-40ff-914d-68492762179c\media__1781186689549.png")
h, w, c = img.shape

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Find circles using HoughCircles
# Let's search for circles with radius between 50 and 200
circles = cv2.HoughCircles(
    gray, 
    cv2.HOUGH_GRADIENT, 
    dp=1, 
    minDist=100,
    param1=50, 
    param2=30, 
    minRadius=50, 
    maxRadius=200
)

if circles is not None:
    circles = np.uint16(np.around(circles))
    print(f"Found {len(circles[0])} circles:")
    for idx, i in enumerate(circles[0]):
        print(f"Circle {idx}: Center=({i[0]}, {i[1]}), Radius={i[2]}")
else:
    print("No circles found using HoughCircles!")

# Let's also find the bounding box of non-black pixels to see where the logo is
# A pixel is foreground if max(R,G,B) > 35
fg_mask = (img[:, :, 0] > 35) | (img[:, :, 1] > 35) | (img[:, :, 2] > 35)
y_idx, x_idx = np.where(fg_mask)
if len(y_idx) > 0:
    print(f"Foreground BBox: Y=[{y_idx.min()}, {y_idx.max()}], X=[{x_idx.min()}, {x_idx.max()}]")
