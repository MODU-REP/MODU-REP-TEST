import os

src_dir = "c:/Users/ASDS/Desktop/REPTIME/modurep/src"
for root, dirs, files in os.walk(src_dir):
    # Skip factories and shop folders
    if "app\\factories" in root or "app\\shop" in root or "node_modules" in root or ".next" in root:
        continue
    for file in files:
        path = os.path.join(root, file)
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            if "/factories" in content or "/shop" in content:
                print(f"Found reference in {path}")
                # Print matching lines
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "/factories" in line or "/shop" in line:
                        print(f"  Line {i+1}: {line.strip()}")
