from math import isfinite


def operation(data, _):
    count = data["samples"]
    if type(count) is not int or count < 0:
        raise ValueError("samples must be a nonnegative integer")
    if count == 0:
        return {"advisory": "no recent data"}
    wave, wind = data["meanWaveFeet"], data["maxWindMph"]
    if not all(isinstance(value, (int, float)) and isfinite(value) and value >= 0 for value in (wave, wind)):
        raise ValueError("Invalid wave or wind reading")
    if wave >= 8 or wind >= 30:
        advisory = "high"
    elif wave >= 4 or wind >= 18:
        advisory = "elevated"
    else:
        advisory = "low"
    return {"advisory": advisory}
