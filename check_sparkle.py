import cv2
import numpy as np

img = cv2.imread(r"C:\Users\ASDS\.gemini\antigravity\brain\864481ff-2f4f-40ff-914d-68492762179c\media__1781186689549.png")
h, w, c = img.shape

# The sparkle/star is bright, let's look for bright pixels in the bottom right quadrant
bottom_right = img[int(h*0.75):, int(w*0.75):]
br_h, br_w, br_c = bottom_right.shape

# Find non-black pixels in bottom right
gray_br = cv2.cvtColor(bottom_right, cv2.COLOR_BGR2GRAY)
y_idx, x_idx = np.where(gray_br > 40)
if len(y_idx) > 0:
    global_y = y_idx + int(h*0.75)
    global_x = x_idx + int(w*0.75)
    print(f"Bright pixels in bottom right: Y=[{global_y.min()}, {global_y.max()}], X=[{global_x.min()}, {global_x.max()}]")
else:
    print("No bright pixels in bottom right quadrant.")
