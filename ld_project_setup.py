import requests
import json
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
API_KEY = os.getenv('LD_API_KEY')
if not API_KEY:
    raise ValueError("LD_API_KEY not found in environment variables")

BASE_URL = 'https://app.launchdarkly.com/api/v2'

headers = {
    'Authorization': API_KEY,
    'Content-Type': 'application/json'
}

def handle_response(response, operation):
    """Handle API response and check for errors"""
    try:
        response.raise_for_status()
        # For successful DELETE operations (204 No Content)
        if response.status_code == 204:
            return None
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error during {operation}:")
        print(f"Status code: {response.status_code}")
        print(f"Response body: {response.text}")
        raise Exception(f"API error during {operation}: {str(e)}")

def create_project():
    """Create a new project named 'Ledger'"""
    url = f'{BASE_URL}/projects'
    payload = {
        'name': 'Ledger',
        'key': 'ledger'
    }
    response = requests.post(url, headers=headers, json=payload)
    result = handle_response(response, "project creation")
    time.sleep(2)
    return result

def list_environments(project_key):
    """List all environments in a project"""
    url = f'{BASE_URL}/projects/{project_key}/environments'
    response = requests.get(url, headers=headers)
    result = handle_response(response, "listing environments")
    time.sleep(2)
    return result.get('items', [])

def delete_environment(project_key, env_key):
    """Delete an environment from a project"""
    url = f'{BASE_URL}/projects/{project_key}/environments/{env_key}'
    response = requests.delete(url, headers=headers)
    handle_response(response, f"deleting environment ({env_key})")
    time.sleep(2)

def create_environment(project_key, env_key, env_name):
    """Create a new environment in the specified project"""
    url = f'{BASE_URL}/projects/{project_key}/environments'
    payload = {
        'name': env_name,
        'key': env_key,
        'color': '417505'  # Green color
    }
    response = requests.post(url, headers=headers, json=payload)
    result = handle_response(response, f"environment creation ({env_name})")
    time.sleep(2)
    return result

def create_boolean_feature_flag(project_key, flag_key, flag_name):
    """Create a new boolean feature flag"""
    url = f'{BASE_URL}/flags/{project_key}'
    payload = {
        'name': flag_name,
        'key': flag_key,
        'description': f'Controls the release of {flag_name}',
        'variations': [
            {
                'value': True,
                'name': 'Enabled'
            },
            {
                'value': False,
                'name': 'Disabled'
            }
        ],
        'defaults': {
            'onVariation': 0,
            'offVariation': 1
        },
        'temporary': False,
        'tags': [],
        'includeInSnippet': True
    }
    response = requests.post(url, headers=headers, json=payload)
    result = handle_response(response, f"boolean flag creation ({flag_name})")
    time.sleep(2)
    return result

def create_multivariate_feature_flag(project_key, flag_key, flag_name, variations, prerequisites=None):
    """Create a new multivariate feature flag and update with prerequisites"""
    # First create the base flag
    url = f'{BASE_URL}/flags/{project_key}'
    payload = {
        'name': flag_name,
        'key': flag_key,
        'description': f'Controls the {flag_name}',
        'variations': variations,
        'defaults': {
            'onVariation': 0,
            'offVariation': 0
        },
        'temporary': False,
        'tags': [],
        'includeInSnippet': True
    }
    
    response = requests.post(url, headers=headers, json=payload)
    flag_result = handle_response(response, f"multivariate flag creation ({flag_name})")
    time.sleep(2)

    # If prerequisites are specified, update the flag with prerequisites
    if prerequisites:
        update_url = f'{BASE_URL}/flags/{project_key}/{flag_key}'
        
        # First get the current flag config to get variation IDs
        get_response = requests.get(update_url, headers=headers)
        current_flag = handle_response(get_response, f"getting flag config for {flag_name}")
        time.sleep(2)

        # Get the 'Enabled' variation ID from the prerequisite flag
        prereq_flag_url = f'{BASE_URL}/flags/{project_key}/{prerequisites[0]["key"]}'
        prereq_response = requests.get(prereq_flag_url, headers=headers)
        prereq_flag = handle_response(prereq_response, "getting prerequisite flag config")
        variation_id = prereq_flag['variations'][0]['_id']  # Get ID of the true/Enabled variation
        time.sleep(2)
        
        patch_headers = headers.copy()
        patch_headers['Content-Type'] = 'application/json; domain-model=launchdarkly.semanticpatch'
        
        prereq_patch = {
            "environmentKey": "testing",
            "instructions": [
                {
                    "kind": "addPrerequisite",
                    "key": prerequisites[0]["key"],
                    "variationId": variation_id
                }
            ]
        }
        
        update_response = requests.patch(update_url, headers=patch_headers, json=prereq_patch)
        handle_response(update_response, f"adding prerequisites to {flag_name}")
        time.sleep(2)

    return flag_result

def create_segment(project_key, env_key, segment_key, segment_name, rules):
    """Create a new segment and update with rules"""
    # First create the base segment
    url = f'{BASE_URL}/segments/{project_key}/{env_key}'
    payload = {
        'name': segment_name,
        'key': segment_key,
        'description': f'Segment for {segment_name}',
        'tags': []
    }
    response = requests.post(url, headers=headers, json=payload)
    result = handle_response(response, f"segment creation ({segment_name})")
    time.sleep(2)

    # Then update it with the rules
    update_url = f'{BASE_URL}/segments/{project_key}/{env_key}/{segment_key}'
    patch_headers = headers.copy()
    patch_headers['Content-Type'] = 'application/json'
    
    rules_patch = {
        "patch": [
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": rules
                }
            }
        ]
    }
    
    update_response = requests.patch(update_url, headers=patch_headers, json=rules_patch)
    handle_response(update_response, f"updating segment rules for {segment_name}")
    time.sleep(2)

    return result

def add_targeting_rules(project_key, flag_key, rules):
    """Add targeting rules to a feature flag"""
    url = f'{BASE_URL}/flags/{project_key}/{flag_key}'
    
    # First get the current flag config to get variation IDs
    get_response = requests.get(url, headers=headers)
    current_flag = handle_response(get_response, f"getting flag config for {flag_key}")
    time.sleep(2)
    
    # Get variation IDs
    variation_map = {
        variation['name']: variation['_id']
        for variation in current_flag['variations']
    }
    
    patch_headers = headers.copy()
    patch_headers['Content-Type'] = 'application/json; domain-model=launchdarkly.semanticpatch'
    
    # Add each rule one at a time
    for rule in rules:
        rule_patch = {
            "environmentKey": "testing",
            "instructions": [
                {
                    "kind": "addRule",
                    "name": rule["name"],
                    "clauses": rule["clauses"],
                    "variationId": variation_map[rule["serve"]]
                }
            ]
        }
        
        update_response = requests.patch(url, headers=patch_headers, json=rule_patch)
        handle_response(update_response, f"adding targeting rule {rule['name']}")
        time.sleep(2)
        
    return True

def main():
    try:
        # Create project
        project = create_project()
        print(f'Created project: {project.get("name", "Unknown")} with key: {project.get("key", "Unknown")}')

        project_key = project.get('key')
        if not project_key:
            raise ValueError("Project creation failed - no project key returned")

        # List existing environments
        print("Listing existing environments...")
        environments = list_environments(project_key)
        for env in environments:
            print(f"Found environment: {env.get('name')} with key: {env.get('key')}")

        # Delete the default "test" environment
        print("Deleting default 'test' environment...")
        delete_environment(project_key, 'test')
        print("Deleted 'test' environment")

        # Create our "testing" environment
        print("Creating 'testing' environment...")
        env = create_environment(project_key, 'testing', 'Testing')
        print(f'Created environment: {env.get("name", "Unknown")} with key: {env.get("key", "Unknown")}')

        # Create EU Countries segment first
        eu_countries = [
            'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
            'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
            'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
            'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
            'Slovenia', 'Spain', 'Sweden'
        ]
        
        eu_countries_rule = {
            'attribute': 'country',
            'op': 'in',
            'values': eu_countries,
            'negate': False,
            'contextKind': 'user'
        }

        eu_segment = create_segment(
            project_key,
            'testing',
            'eu-countries',
            'EU Countries',
            [eu_countries_rule]
        )
        print(f'Created EU Countries segment: {eu_segment.get("name", "Unknown")} with key: {eu_segment.get("key", "Unknown")}')

        # Create GDPR Territorial Scope segment
        eea_countries = ['Norway', 'Iceland', 'Liechtenstein', 'United Kingdom']
        
        gdpr_scope_rules = [
            {
                'attribute': 'segmentMatch',
                'op': 'segmentMatch',
                'values': ['eu-countries'],
                'negate': False,
                'contextKind': 'user'
            },
            {
                'attribute': 'country',
                'op': 'in',
                'values': eea_countries,
                'negate': False,
                'contextKind': 'user'
            }
        ]

        gdpr_segment = create_segment(
            project_key,
            'testing',
            'gdpr-territorial-scope',
            'GDPR Territorial Scope',
            gdpr_scope_rules
        )
        print(f'Created GDPR Territorial Scope segment: {gdpr_segment.get("name", "Unknown")} with key: {gdpr_segment.get("key", "Unknown")}')

        # Now create feature flags
        boolean_flags = [
            ('release-laptop-life-remaining', 'Release Laptop Life Remaining'),
            ('release-marketing-security-report', 'Release Marketing Security Report')
        ]

        for flag_key, flag_name in boolean_flags:
            flag = create_boolean_feature_flag(project_key, flag_key, flag_name)
            print(f'Created boolean feature flag: {flag.get("name", "Unknown")} with key: {flag.get("key", "Unknown")}')

        # Create multivariate feature flag with prerequisite
        region_variations = [
            {
                'value': 'SOC2',
                'name': 'Default'
            },
            {
                'value': 'GDPR',
                'name': 'Europe'
            },
            {
                'value': 'CCPA',
                'name': 'California'
            }
        ]
        
        prerequisites = [{
            'key': 'release-marketing-security-report',
            'variation': 0  # Index 0 corresponds to 'true/Enabled'
        }]

        multivariate_flag = create_multivariate_feature_flag(
            project_key,
            'show-region-based-security-report',
            'Show Region Based Security Report',
            region_variations,
            prerequisites
        )
        print(f'Created multivariate feature flag: {multivariate_flag.get("name", "Unknown")} with key: {multivariate_flag.get("key", "Unknown")}')

        # Add targeting rules to the multivariate flag
        california_rule = {
            "name": "Rule for California Users",
            "clauses": [
                {
                    "contextKind": "user",
                    "attribute": "state",
                    "op": "in",
                    "values": ["California"],
                    "negate": False
                }
            ],
            "serve": "California"
        }

        gdpr_rule = {
            "name": "Rule for GDPR territorial scope",
            "clauses": [
                {
                    "contextKind": "user",
                    "attribute": "segmentMatch",
                    "op": "segmentMatch",
                    "values": ["gdpr-territorial-scope"],
                    "negate": False
                }
            ],
            "serve": "Europe"
        }

        targeting_rules = [california_rule, gdpr_rule]
        add_targeting_rules(project_key, 'show-region-based-security-report', targeting_rules)
        print("Added targeting rules to show-region-based-security-report flag")

    except Exception as e:
        print(f"Error during execution: {str(e)}")
        raise

if __name__ == '__main__':
    main()