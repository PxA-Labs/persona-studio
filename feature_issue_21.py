import unittest
from unittest.mock import MagicMock

def generate_image(width, height):
    # Function to be tested
    return MagicMock(width=width, height=height)

class TestGenerateImage(unittest.TestCase):
    def test_generate_image(self):
        # Test case
        width, height = 100, 200
        image = generate_image(width, height)
        self.assertIsNotNone(image)
        self.assertEqual(image.width, width)
        self.assertEqual(image.height, height)

if __name__ == '__main__':
    unittest.main()