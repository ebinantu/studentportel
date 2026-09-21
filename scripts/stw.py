import tkinter as tk
import time

class Stopwatch:
    def __init__(self, root):
        self.root = root
        self.root.title("Simple Stopwatch")
        self.root.geometry("300x400")

        self.running = False
        self.start_time = 0
        self.elapsed_time = 0
        self.lap_count = 1

        self.time_label = tk.Label(root, text="00:00:00", font=("Helvetica", 30))
        self.time_label.pack(pady=20)

        btn_frame = tk.Frame(root)
        btn_frame.pack()

        self.start_btn = tk.Button(btn_frame, text="Start", width=8, command=self.start)
        self.start_btn.grid(row=0, column=0, padx=5)

        self.stop_btn = tk.Button(btn_frame, text="Stop", width=8, command=self.stop)
        self.stop_btn.grid(row=0, column=1, padx=5)

        self.lap_btn = tk.Button(btn_frame, text="Lap", width=8, command=self.lap)
        self.lap_btn.grid(row=1, column=0, padx=5, pady=5)

        self.reset_btn = tk.Button(btn_frame, text="Reset", width=8, command=self.reset)
        self.reset_btn.grid(row=1, column=1, padx=5, pady=5)

        
        self.lap_list = tk.Listbox(root, width=30)
        self.lap_list.pack(pady=10)

        self.update_time()

    def start(self):
        if not self.running:
            self.running = True
            self.start_time = time.time() - self.elapsed_time

    def stop(self):
        if self.running:
            self.running = False
            self.elapsed_time = time.time() - self.start_time

    def reset(self):
        self.running = False
        self.start_time = 0
        self.elapsed_time = 0
        self.lap_count = 1
        self.time_label.config(text="00:00:00")
        self.lap_list.delete(0, tk.END)

    def lap(self):
        if self.running:
            lap_time = self.format_time(self.elapsed_time)
            self.lap_list.insert(tk.END, f"Lap {self.lap_count}: {lap_time}")
            self.lap_count += 1

    def update_time(self):
        if self.running:
            self.elapsed_time = time.time() - self.start_time
            self.time_label.config(text=self.format_time(self.elapsed_time))
        self.root.after(100, self.update_time)

    def format_time(self, seconds):
        mins = int(seconds // 60)
        secs = int(seconds % 60)
        millis = int((seconds - int(seconds)) * 100)
        return f"{mins:02}:{secs:02}:{millis:02}"


if __name__ == "__main__":
    root = tk.Tk()
    app = Stopwatch(root)
    root.mainloop()
