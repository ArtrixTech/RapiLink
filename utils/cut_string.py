def cut_string(input_str, head, tail):
    if isinstance(head, str) and isinstance(tail, str) and isinstance(input_str, str):
        start = input_str.find(head) + len(head)
        end = input_str.find(tail, start)

        if start == -1:
            raise AttributeError("Head not found in target.")
        if end == -1:
            raise AttributeError("Tail not found in target.")

        rt_str = ""
        for index in range(start, end):
            rt_str += input_str[index]
        return rt_str
    else:
        raise TypeError("Inputs are not string!")
