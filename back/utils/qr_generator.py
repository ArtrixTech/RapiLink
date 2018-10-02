import qrcode
from PIL import Image


def replace_color(img, color_be_replaced, color_replacement):
    if isinstance(img, Image.Image):

        img_w, img_h = img.size

        for x in range(img_w):
            for y in range(img_h):
                px = img.getpixel((x, y))
                if px[0] == color_be_replaced[0]:
                    if px == color_be_replaced:
                        img.putpixel((x, y), color_replacement)
                else:
                    img.putpixel((x, y), (255, 255, 255, color_replacement[3]))

        return img

    raise TypeError("Not a PIL Image.")


def gen_qr_code(content, color):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(content)
    qr.make()

    qr_img = qr.make_image(fill_color="black", back_color="white")
    factor = 10

    qr_img = qr_img.resize((int(qr_img.size[0] / factor), int(qr_img.size[0] / factor)))
    qr_img = qr_img.convert("RGBA")
    qr_img = replace_color(qr_img, (0, 0, 0, 255), color)
    qr_img = qr_img.resize((200, 200))

    return qr_img
