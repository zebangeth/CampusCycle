import json
import os

def modify_json_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            with open(file_path, "r") as file:
                data = json.load(file)

            modified_data = []
            for item in data:
                if "_id" in item and "$oid" in item["_id"]:
                    item["_id"] = "ObjectId('" + item["_id"]["$oid"] + "')"
                modified_data.append(item)

            with open(file_path, "w") as file:
                json.dump(modified_data, file, indent=2)

            print(f"Modified {filename}")

# Directory containing the JSON files
directory = "."  # Current directory

# Call the function to modify the JSON files
modify_json_files(directory)