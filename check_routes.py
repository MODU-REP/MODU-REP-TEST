import os

app_dir = "c:/Users/ASDS/Desktop/REPTIME/modurep/src/app"
routes = ["", "community", "brands", "factories", "magazine", "prices", "shop"]

print("Checking menu pages in src/app:")
for r in routes:
    path = os.path.join(app_dir, r)
    page_file = os.path.join(path, "page.tsx")
    exists = os.path.exists(page_file)
    print(f"- /{r} ({'Home' if r == '' else r}): {'Exists' if exists else 'Not found'} ({page_file})")
    if exists:
        # Check size of page.tsx to see if it has actual content or is empty
        size = os.path.getsize(page_file)
        print(f"  Size: {size} bytes")
