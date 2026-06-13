import os
import time

def find_recent_files(root_dir, mins=10):
    now = time.time()
    cutoff = now - mins * 60
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and .next
        if "node_modules" in root or ".next" in root or ".git" in root:
            continue
        for file in files:
            path = os.path.join(root, file)
            try:
                mtime = os.path.getmtime(path)
                if mtime > cutoff:
                    print(f"{path}: size={os.path.getsize(path)}, modified_time={time.ctime(mtime)}")
            except Exception as e:
                pass

print("\nRecent files in App Data:")
find_recent_files("C:/Users/ASDS/.gemini/antigravity")
print("\nRecent files in REPTIME:")
find_recent_files("c:/Users/ASDS/Desktop/REPTIME")
