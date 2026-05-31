try:
    from pypdf import PdfReader
    reader = PdfReader("CV_ATS_Salsabilla.pdf")
    for page_num, page in enumerate(reader.pages):
        print(f"--- PAGE {page_num + 1} ---")
        print(page.extract_text())
        print()
except Exception as e:
    print(f"pypdf Error: {e}")
    try:
        import pdfplumber
        with pdfplumber.open("CV_ATS_Salsabilla.pdf") as pdf:
            for page_num, page in enumerate(pdf.pages):
                print(f"--- PAGE {page_num + 1} ---")
                print(page.extract_text())
                print()
    except Exception as e2:
        print(f"pdfplumber Error: {e2}")
        print("Installing required libraries...")
        import subprocess
        subprocess.check_call(["pip", "install", "pypdf", "pdfplumber"])
