"""
Importer for batch importing images.

Usage:
    python images.py /path/to/images /path/to/catalog

    Images: can be in subfolders, the script looks for anything ending in *.jpg.
    Catalog: This is the path you later have to point the application to.
"""
from PIL import Image
from tqdm import tqdm
import glob
import os
import shutil
import sys

THUMBNAIL_SIZE = 128, 128

if __name__ == '__main__':
    if not len(sys.argv) > 2:
        print('⚠️    Folder arguments missing')
        print(__doc__)
        sys.exit(1)
    images_path = sys.argv[1]
    catalog_path = sys.argv[2]

    image_files = glob.glob(os.path.join(images_path, '**/*.jpg'))

    for image_file in tqdm(image_files):
        try:
            fname, _ = os.path.splitext(os.path.basename(image_file))
            book, page = fname.split('_')[:2]   # Some of them have `_edited` attached
            book = book.upper()
            correct_fname = '{}_{}.jpg'.format(book, page)
            out_path = os.path.join(catalog_path, book, page, correct_fname)
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            shutil.copyfile(image_file, out_path)

            im = Image.open(image_file)
            im.thumbnail(THUMBNAIL_SIZE)
            thumbnail_fname = '{}_{}_thumbnail.jpg'.format(book, page)
            thumbnail_out_path = os.path.join(catalog_path, book.upper(), page, thumbnail_fname)
            im.save(thumbnail_out_path, "JPEG")
        except Exception as e:
            print(image_file, out_path)
            print(e)
