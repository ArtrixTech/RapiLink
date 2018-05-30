import os, sys


def get_save_location(file_name, batch_id):
    """
    - Generate the proper directory and return the location
    :param file_name: Name of the file
    :param batch_id: Batch ID to generate the directory
    :return: Location for saving file. The path will be relative to the current working path.
    """
    if not os.path.exists("saved_files"):
        os.makedirs("saved_files")

    if "linux" in sys.platform:

        if not os.path.exists("saved_files/" + batch_id):
            os.makedirs("saved_files/" + batch_id)

        return "saved_files/" + batch_id + "/" + file_name

    else:

        if not os.path.exists("saved_files\\" + batch_id):
            os.makedirs("saved_files\\" + batch_id)

        return "saved_files\\" + batch_id + "\\" + file_name
