import string
import secrets

def generate_password(length, use_digits, use_symbols, use_uppercase):
    # Base character set: lowercase letters
    chars = string.ascii_lowercase
    
    # Add optional character sets based on user preference
    if use_uppercase:
        chars += string.ascii_uppercase
    if use_digits:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation

    # Use 'secrets' for cryptographically secure random selection
    password = "".join(secrets.choice(chars) for _ in range(length))
    return password

def main():
    print("--- Password Generator ---")
    
    try:
        # Input parameters
        length = int(input("Enter password length: "))
        inc_upper = input("Include uppercase letters? (y/n): ").lower() == 'y'
        inc_nums = input("Include numbers? (y/n): ").lower() == 'y'
        inc_syms = input("Include symbols? (y/n): ").lower() == 'y'
        
        # Validation
        if length < 1:
            print("Error: Length must be at least 1.")1
            return

        # Generation
        password = generate_password(length, inc_nums, inc_syms, inc_upper)
        
        # Display
        print("\n------------------------------")
        print(f"Generated Password: {password}")
        print("------------------------------")
        
        # Basic Strength check
        strength = "Weak"
        if length >= 12 and inc_nums and inc_syms:
            strength = "Strong"
        elif length >= 8:
            strength = "Medium"
        print(f"Password Strength: {strength}")

    except ValueError:
        print("Error: Please enter a valid number for the length.")

if __name__ == "__main__":
    main()