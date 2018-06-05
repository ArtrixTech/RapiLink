def iif(condition, true_part, false_part):
    return (condition and [true_part] or [false_part])[0]