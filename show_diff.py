import difflib, pathlib

files = [
    ('vehicleService', 'lib/vehicleService.ts'),
    ('route_vehicle', 'app/api/admin/vehicles/route.ts'),
    ('route_image', 'app/api/admin/vehicles/[id]/images/[imageId]/route.ts'),
]

for name, path in files:
    old_path = pathlib.Path(f'old_{name}.ts')
    new_path = pathlib.Path(path)
    print('########## DIFF', name)
    if not old_path.exists():
        print('old file not found:', old_path)
        continue
    old = old_path.read_text().splitlines(keepends=True)
    new = new_path.read_text().splitlines(keepends=True)
    diff = ''.join(difflib.unified_diff(old, new, fromfile=str(old_path), tofile=str(new_path)))
    print(diff)
