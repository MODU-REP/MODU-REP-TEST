import os

src_dir = "c:/Users/ASDS/Desktop/REPTIME/modurep/src"
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".ts", ".tsx", ".css")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "logo" in content.lower():
                    print(f"Found in {path}")
                    # print lines containing logo
                    lines = content.splitlines()
                    for i, line in enumerate(lines):
                        if "logo" in line.lower():
                            print(f"  Line {i+1}: {line.strip()}")
