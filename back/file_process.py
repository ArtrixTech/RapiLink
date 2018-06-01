import os, sys
import shutil


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


def get_location_by_batch_id(batch_id):
    if "linux" in sys.platform:
        return "saved_files/" + batch_id

    else:
        return "saved_files\\" + batch_id


def kill_dir_by_batch_id(batch_id):
    """
    - Generate the proper directory and return the location
    :param file_name: Name of the file
    :param batch_id: Batch ID to generate the directory
    :return: Location for saving file. The path will be relative to the current working path.
    """
    if os.path.exists("saved_files"):

        if "linux" in sys.platform:

            if not os.path.exists("saved_files/" + batch_id):
                raise KeyError("Dir not exist!")

            else:
                shutil.rmtree("saved_files/" + batch_id)

        else:

            if not os.path.exists("saved_files\\" + batch_id):
                raise KeyError("Dir not exist!")

            else:
                shutil.rmtree("saved_files\\" + batch_id)
