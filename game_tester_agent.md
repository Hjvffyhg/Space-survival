# 🎮 GameTesterAgent (Google AI Studio)

## 🧠 Overview

GameTesterAgent is an AI-powered testing assistant designed to:

- Automatically playtest a 2D game
- Capture screenshots during gameplay
- Generate a user-friendly introduction or tutorial

This agent is useful for:
- Game demos
- Debugging gameplay flow
- Automated testing
- Showcasing progress

---

## ✨ Editable AI Introduction (Dynamic Section)

> ⚠️ This section is meant to be improved by AI over time.

**Current Version:**

Welcome to **Space Survival**, a pulse-pounding top-down 2D space shooter experience!  
As a lone cyan fighter, you are tasked with defending your sector against the relentless Kla'ed armada across evolving Kardashev Civilization eras.

Use WASD to navigate the deadly void and click to unleash your arsenal against the enemy fleet's dynamic CPU-scheduling-driven attack waves. Stay alert, weave through chaotic bullet-hell barrages, strategically prioritize your targets, and survive the massive boss encounters!

---

**AI Instruction:**

You may rewrite or improve this introduction to:
- Make it more engaging
- Match the game style (e.g., action, horror, sci-fi)
- Add beginner tips
- Adjust tone (fun, serious, epic)

---

## 🤖 Agent Configuration (JSON)

```json
{
  "name": "GameTesterAgent",
  "description": "An agent that playtests a 2D game, captures screenshots, and generates a user introduction.",
  "instructions": "You are an automated game testing agent.\n\nYour job is to:\n1. Start and play the game using the play_game tool.\n2. Capture screenshots during important gameplay moments using capture_screenshot.\n3. Generate a user-friendly introduction at the end using generate_intro.\n\nAlways follow this order:\n- First call play_game\n- Then capture multiple screenshots\n- Finally call generate_intro\n\nFocus on testing gameplay and presenting a simple demo experience.",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "play_game",
        "description": "Simulates gameplay by sending control inputs to the game.",
        "parameters": {
          "type": "object",
          "properties": {
            "duration": {
              "type": "number",
              "description": "Duration of gameplay in seconds"
            },
            "difficulty": {
              "type": "string",
              "enum": ["easy", "normal", "hard"]
            }
          },
          "required": ["duration"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "capture_screenshot",
        "description": "Captures the current state of the game screen.",
        "parameters": {
          "type": "object",
          "properties": {
            "label": {
              "type": "string",
              "description": "Label describing the screenshot moment"
            }
          },
          "required": ["label"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "generate_intro",
        "description": "Generates a simple user introduction or tutorial for the game.",
        "parameters": {
          "type": "object",
          "properties": {
            "game_name": {
              "type": "string"
            },
            "genre": {
              "type": "string"
            }
          },
          "required": ["game_name"]
        }
      }
    }
  ],
  "tool_config": {
    "function_calling_config": {
      "mode": "AUTO"
    }
  }
}
```

🔄 Expected Workflow
Agent calls:
play_game(duration=60)
During gameplay:
capture_screenshot("start")
capture_screenshot("mid_game")
capture_screenshot("boss_fight")
After gameplay:
generate_intro(game_name, genre)
