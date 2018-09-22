import os
import sys
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


def get_file_root(batch_id):
    """
    - Return the file directory location by batch_id
    :param batch_id: Batch ID of the file
    :return: Directory in the name of this batch_id
    """
    if "linux" in sys.platform:
        if os.path.exists("saved_files/" + batch_id):
            return "saved_files/" + batch_id
        else:
            raise NotADirectoryError("Directory Not Found", "saved_files/" + batch_id)

    else:
        if os.path.exists("saved_files\\" + batch_id):
            return "saved_files\\" + batch_id
        else:
            raise NotADirectoryError("Directory Not Found", "saved_files\\" + batch_id)


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
